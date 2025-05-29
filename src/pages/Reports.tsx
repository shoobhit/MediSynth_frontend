import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Trash2, FilePlus, FileText, Share, Printer, Stethoscope, Microscope } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Report {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  reportType: string;
  createdAt: string;
  content: string;
  cam_url?: string;
  predictions?: { [key: string]: number };
  top_class?: string;
  xray_image_url?: string;
}

const Reports = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const savedReports = JSON.parse(localStorage.getItem('patientReports') || '[]');
    setReports(savedReports);
  }, []);

  const [newReport, setNewReport] = useState({
    patientName: '',
    patientAge: '',
    patientGender: '',
    reportType: '',
    content: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReportTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'xray': 'X-Ray',
      'mri': 'MRI',
      'ct': 'CT Scan',
      'ultrasound': 'Ultrasound',
      'ekg': 'EKG'
    };
    return types[type] || type;
  };

  const handleAddReport = () => {
    if (!newReport.patientName || !newReport.patientAge || !newReport.patientGender || !newReport.reportType || !newReport.content) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields",
        variant: "destructive"
      });
      return;
    }

    const report: Report = {
      id: Date.now().toString(),
      patientName: newReport.patientName,
      patientAge: parseInt(newReport.patientAge),
      patientGender: newReport.patientGender,
      reportType: newReport.reportType,
      createdAt: new Date().toISOString(),
      content: newReport.content
    };

    const updatedReports = [report, ...reports];
    setReports(updatedReports);
    localStorage.setItem('patientReports', JSON.stringify(updatedReports));

    setNewReport({
      patientName: '',
      patientAge: '',
      patientGender: '',
      reportType: '',
      content: ''
    });

    toast({
      title: "Report added",
      description: "The patient report has been added successfully",
    });

    setIsDialogOpen(false);
  };

  const handleDeleteReport = (id: string) => {
    const updatedReports = reports.filter(report => report.id !== id);
    setReports(updatedReports);
    localStorage.setItem('patientReports', JSON.stringify(updatedReports));

    toast({
      title: "Report deleted",
      description: "The patient report has been removed",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReport(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewReport(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const downloadPDF = async (report: Report) => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    const margin = 10;
    let yPosition = margin;

    // Header
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('MediSynth Radiology Report', margin, yPosition);

    // Image at the top-right corner
    let imageHeight = 0;
    let imageStartY = margin; // Start at the top
    if (report.cam_url || report.xray_image_url) {
      const imgUrl = report.xray_image_url || report.cam_url;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imgUrl || '';
      await new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });

      const imgWidth = 52.91; // 200px converted to mm (1mm = 3.78px)
      imageHeight = 52.91; // 200px converted to mm
      pdf.addImage(img, 'PNG', width - margin - imgWidth, imageStartY, imgWidth, imageHeight);
    }

    // Patient Details (below header, not affected by image)
    yPosition += 10;
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Patient: ${report.patientName}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Age: ${report.patientAge} years`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Gender: ${report.patientGender}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Examination Type: ${getReportTypeLabel(report.reportType)}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Date of Examination: ${formatDate(report.createdAt)}`, margin, yPosition);
    yPosition += 10;

    // Report Findings (immediately after Date of Examination)
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Report Findings', margin, yPosition);
    yPosition += 8;

    // Parse and format content
    const lines = report.content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    pdf.setFontSize(10);
    let indentation = 0;
    let isDetailedAnalysis = false;
    let diseaseSection = false; // Flag to bold subsections under diseases
    let highConfidenceDiseases: string[] = []; // Array to store high-confidence diseases

    // Step 1: Extract high-confidence diseases from Summary of Findings
    let inSummarySection = false;
    for (const line of lines) {
      const trimmedLine = line.replace(/[*"]/g, '').trim();
      if (trimmedLine.toLowerCase().startsWith('summary of findings')) {
        inSummarySection = true;
        continue;
      }
      if (inSummarySection && trimmedLine.toLowerCase().startsWith('detailed analysis')) {
        inSummarySection = false;
        break;
      }
      if (inSummarySection && trimmedLine.startsWith('-')) {
        const match = trimmedLine.match(/^- (.+?): \d+%$/); // Match lines like "- Mass: 92%"
        if (match) {
          const diseaseName = match[1].trim();
          highConfidenceDiseases.push(diseaseName);
        }
      }
    }

    // Step 2: Process the content and center diseases, bold subheadings
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].replace(/[*"]/g, '').trim();
      if (!line) continue;

      // Check for page overflow
      if (yPosition + 6 > height - margin - 20) {
        pdf.addPage();
        yPosition = margin;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        yPosition += 8;
        pdf.setFontSize(10);
      }

      if (line.toLowerCase().startsWith('summary of findings')) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Summary of Findings:', margin, yPosition);
        yPosition += 6;
        indentation = 5;
        pdf.setFont('helvetica', 'normal');
        isDetailedAnalysis = false;
      } else if (line.toLowerCase().startsWith('detailed analysis')) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Detailed Analysis:', margin, yPosition);
        yPosition += 6;
        indentation = 5;
        pdf.setFont('helvetica', 'normal');
        isDetailedAnalysis = true;
      } else if (line.toLowerCase().startsWith('interpretation')) {
        pdf.setFont('helvetica', 'bold');
        pdf.text('Interpretation:', margin, yPosition);
        yPosition += 6;
        indentation = 5;
        pdf.setFont('helvetica', 'normal');
        diseaseSection = false; // Reset disease section flag
      } else if (isDetailedAnalysis && !line.includes(':') && !line.startsWith('-')) {
        // Check if the line is a high-confidence disease (from Summary of Findings)
        const isHighConfidenceDisease = highConfidenceDiseases.includes(line.trim());
        if (isHighConfidenceDisease) {
          // Center the disease name
          pdf.setFont('helvetica', 'bold');
          const textWidth = pdf.getTextWidth(line);
          const xPosition = (width - textWidth) / 2; // Center the text
          pdf.text(line, xPosition, yPosition);
          yPosition += 6;
          pdf.setFont('helvetica', 'normal');
          diseaseSection = true; // Start bolding subsections
        } else {
          // Non-high-confidence disease, keep as is
          pdf.setFont('helvetica', 'normal');
          const splitText = pdf.splitTextToSize(line, width - margin * 2 - indentation);
          for (const textLine of splitText) {
            if (yPosition + 6 > height - margin - 20) {
              pdf.addPage();
              yPosition = margin;
              pdf.setFontSize(14);
              pdf.setFont('helvetica', 'bold');
              yPosition += 8;
              pdf.setFontSize(10);
            }
            pdf.text(textLine, margin + indentation, yPosition);
            yPosition += 6;
          }
        }
      } else if (isDetailedAnalysis && diseaseSection && line.toLowerCase().includes(':')) {
        // Bold the subsections under high-confidence diseases (Radiographic Findings, etc.)
        const [header, ...details] = line.split(':');
        const detailText = details.join(':').trim();
        pdf.setFont('helvetica', 'bold');
        pdf.text(header.trim() + ':', margin + indentation, yPosition);
        yPosition += 6;
        pdf.setFont('helvetica', 'normal');
        if (detailText) {
          const splitText = pdf.splitTextToSize(detailText, width - margin * 2 - indentation - 10);
          for (const textLine of splitText) {
            if (yPosition + 6 > height - margin - 20) {
              pdf.addPage();
              yPosition = margin;
              pdf.setFontSize(14);
              pdf.setFont('helvetica', 'bold');
              yPosition += 8;
              pdf.setFontSize(10);
            }
            pdf.text(textLine, margin + indentation + 10, yPosition);
            yPosition += 6;
          }
        }
        // Check if next line is another disease (not a subsection)
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1].replace(/[*"]/g, '').trim();
          if (!nextLine.includes(':') && !nextLine.startsWith('-') && !nextLine.toLowerCase().startsWith('interpretation')) {
            diseaseSection = false; // Reset disease section flag for next disease
          }
        }
      } else if (line.toLowerCase().includes(':')) {
        const [header, ...details] = line.split(':');
        const detailText = details.join(':').trim();
        pdf.setFont('helvetica', 'bold');
        pdf.text(header.trim() + ':', margin + indentation, yPosition);
        yPosition += 6;
        pdf.setFont('helvetica', 'normal');
        if (detailText) {
          const splitText = pdf.splitTextToSize(detailText, width - margin * 2 - indentation - 10);
          for (const textLine of splitText) {
            if (yPosition + 6 > height - margin - 20) {
              pdf.addPage();
              yPosition = margin;
              pdf.setFontSize(14);
              pdf.setFont('helvetica', 'bold');
              yPosition += 8;
              pdf.setFontSize(10);
            }
            pdf.text(textLine, margin + indentation + 10, yPosition);
            yPosition += 6;
          }
        }
        indentation = isDetailedAnalysis ? 15 : 5;
      } else if (line.startsWith('-')) {
        pdf.setFont('helvetica', 'normal');
        const splitText = pdf.splitTextToSize(line, width - margin * 2 - indentation);
        for (const textLine of splitText) {
          if (yPosition + 6 > height - margin - 20) {
            pdf.addPage();
            yPosition = margin;
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            yPosition += 8;
            pdf.setFontSize(10);
          }
          pdf.text(textLine, margin + indentation, yPosition);
          yPosition += 6;
        }
      } else if (isDetailedAnalysis && line.length > 0) {
        pdf.setFont('helvetica', 'normal');
        const splitText = pdf.splitTextToSize(line, width - margin * 2 - indentation - 10);
        for (const textLine of splitText) {
          if (yPosition + 6 > height - margin - 20) {
            pdf.addPage();
            yPosition = margin;
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            yPosition += 8;
            pdf.setFontSize(10);
          }
          pdf.text(textLine, margin + indentation + 10, yPosition);
          yPosition += 6;
        }
      }
      yPosition += 2; // Small gap between lines
    }

    // Footer on the last page
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('Generated by MediSynth AI. For clinical use, consult a qualified radiologist.', margin, height - margin);

    pdf.save(`report_${report.patientName}_${report.id}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      <style>
        {`
          .medical-report {
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.6;
            color: #333;
          }
          .medical-report h1, .medical-report h2, .medical-report h3 {
            font-weight: bold;
            margin-top: 1em;
            margin-bottom: 0.5em;
          }
          .medical-report p {
            margin: 0.75em 0;
            line-height: 1.6;
          }
          .medical-report ul {
            list-style-type: disc;
            padding-left: 2em;
            margin: 0.5em 0;
          }
          .medical-report li {
            margin: 0.3em 0;
            line-height: 1.6;
          }
          .report-content {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
          }
          .report-text {
            flex: 1;
            min-width: 0;
          }
          .image-container {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .report-image {
            flex: 0 0 auto;
            max-width: 300px;
            max-height: 300px;
          }
        `}
      </style>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="mr-2">
              <Microscope className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <span className="text-xl font-bold">MediSynth</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/dashboard" className="font-medium text-gray-600 hover:text-primary">Dashboard</Link>
            <Link to="/reports" className="font-medium text-primary">Reports</Link>
            <Link to="/" className="font-medium text-gray-600 hover:text-primary">Logout</Link>
            {/* <Link to="/">
              <Button variant="ghost">Logout</Button>
            </Link> */}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Reports</h1>
          <div className="flex space-x-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="form-button">
                  <FilePlus className="mr-2 h-4 w-4" />
                  Add New Report
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] form-container animate-scale-in">
                <DialogHeader>
                  <DialogTitle>Add Patient Report</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="patientName" className="text-sm font-medium">Patient Name</label>
                      <Input
                        id="patientName"
                        name="patientName"
                        value={newReport.patientName}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="patientAge" className="text-sm font-medium">Age</label>
                      <Input
                        id="patientAge"
                        name="patientAge"
                        type="number"
                        value={newReport.patientAge}
                        onChange={handleInputChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="patientGender" className="text-sm font-medium">Gender</label>
                      <Select 
                        value={newReport.patientGender} 
                        onValueChange={(value) => handleSelectChange('patientGender', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="reportType" className="text-sm font-medium">Report Type</label>
                      <Select 
                        value={newReport.reportType} 
                        onValueChange={(value) => handleSelectChange('reportType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xray">X-Ray</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium">Report Findings</label>
                    <Textarea
                      id="content"
                      name="content"
                      value={newReport.content}
                      onChange={handleInputChange}
                      rows={5}
                      className="form-input resize-none"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddReport} className="form-button">
                    Add Report
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Link to="/dashboard">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </Link>
          </div>
        </div>
        
        {reports.length === 0 ? (
          <Card className="animate-scale-in">
            <CardContent className="py-10 text-center">
              <p className="text-gray-500 mb-4">You haven't generated any reports yet.</p>
              <Link to="/dashboard">
                <Button className="form-button">Generate Your First Report</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <Card key={report.id} className="overflow-hidden animate-scale-in">
                <CardHeader className="bg-muted/50">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                    <div>
                      <CardTitle>{report.patientName}</CardTitle>
                      <CardDescription className="mt-1">
                        {report.patientAge} years, {report.patientGender}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-start md:items-end">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {getReportTypeLabel(report.reportType)}
                      </span>
                      <time className="text-sm text-muted-foreground mt-1">
                        {formatDate(report.createdAt)}
                      </time>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-2">Report Findings</h3>
                  <div id={`report-${report.id}`} className="report-content">
                    <div className="report-text medical-report">
                      <ReactMarkdown>{report.content}</ReactMarkdown>
                    </div>
                    {(report.cam_url || report.xray_image_url) && (
                      <div className="image-container">
                        <div className="report-image">
                          <h4 className="text-md font-medium">Class Activation Map ({report.top_class || 'N/A'})</h4>
                          <img src={report.xray_image_url || report.cam_url} alt="CAM or X-ray" className="mt-2 max-w-full h-auto border rounded" />
                        </div>
                        {report.predictions && (
                          <div>
                            <h4 className="text-md font-medium mt-4">Predictions</h4>
                            <ul className="list-disc pl-5">
                              {Object.entries(report.predictions).map(([cls, prob]) => (
                                <li key={cls} className={cls === report.top_class ? 'font-bold' : ''}>
                                  {cls}: {(prob * 100).toFixed(2)}%
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <Button variant="outline" size="sm" onClick={() => downloadPDF(report)}>
                      Download PDF
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Share className="mr-1 h-4 w-4" />
                        Share
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Printer className="mr-1 h-4 w-4" />
                        Print
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Reports;