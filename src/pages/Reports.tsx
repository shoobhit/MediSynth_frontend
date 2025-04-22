
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Reports = () => {
  // Simulated reports data - in a real app, this would come from an API
  const reports = [
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
  ];

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="MediSynth Logo" className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold">MediSynth</span>
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
          <Link to="/dashboard">
            <Button>Generate New Report</Button>
          </Link>
        </div>
        
        {reports.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-gray-500 mb-4">You haven't generated any reports yet.</p>
              <Link to="/dashboard">
                <Button>Generate Your First Report</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {reports.map((report) => (
              <Card key={report.id} className="overflow-hidden">
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
                        Share
                      </Button>
                      <Button variant="ghost" size="sm">
                        Print
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
