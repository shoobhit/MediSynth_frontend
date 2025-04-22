
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Trash2, FilePlus, FileText, Share, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Report {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  reportType: string;
  createdAt: string;
  content: string;
}

const Reports = () => {
  // Toast notification
  const { toast } = useToast();
  
  // Simulated reports data with useState to manage them
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      patientName: 'Sarah Johnson',
      patientAge: 45,
      patientGender: 'Female',
      reportType: 'xray',
      createdAt: '2025-04-21T14:30:00Z',
      content: 'The lungs are clear with no evidence of active infiltrate. No pneumothorax or pleural effusion is identified. The cardiac silhouette is normal in size. The mediastinum is unremarkable. Osseous structures are intact.'
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      patientAge: 62,
      patientGender: 'Male',
      reportType: 'mri',
      createdAt: '2025-04-20T10:15:00Z',
      content: 'The brain demonstrates normal gray-white matter differentiation. No evidence of acute infarction, mass effect, or midline shift. The ventricles and sulci are normal in size and configuration. No abnormal enhancement is seen.'
    }
  ]);

  // New report form state
  const [newReport, setNewReport] = useState({
    patientName: '',
    patientAge: '',
    patientGender: '',
    reportType: '',
    content: ''
  });

  // Dialog state
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
    // Validate form
    if (!newReport.patientName || !newReport.patientAge || !newReport.patientGender || !newReport.reportType || !newReport.content) {
      toast({
        title: "Missing information",
        description: "Please fill in all the required fields",
        variant: "destructive"
      });
      return;
    }

    // Create new report object
    const report: Report = {
      id: Date.now().toString(),
      patientName: newReport.patientName,
      patientAge: parseInt(newReport.patientAge),
      patientGender: newReport.patientGender,
      reportType: newReport.reportType,
      createdAt: new Date().toISOString(),
      content: newReport.content
    };

    // Add to reports array
    setReports(prev => [report, ...prev]);

    // Reset form and close dialog
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
    setReports(prev => prev.filter(report => report.id !== id));
    
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

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="heart-pulse">❤️</div>
            <span className="text-xl font-bold ml-2">MediSynth</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/dashboard" className="font-medium text-gray-600 hover:text-primary">Dashboard</Link>
            <Link to="/reports" className="font-medium text-primary">Reports</Link>
            <Link to="/">
              <Button variant="ghost">Logout</Button>
            </Link>
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
                          <SelectItem value="mri">MRI</SelectItem>
                          <SelectItem value="ct">CT Scan</SelectItem>
                          <SelectItem value="ultrasound">Ultrasound</SelectItem>
                          <SelectItem value="ekg">EKG</SelectItem>
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
                  <p className="text-gray-700 whitespace-pre-line">{report.content}</p>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <Button variant="outline" size="sm">
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
