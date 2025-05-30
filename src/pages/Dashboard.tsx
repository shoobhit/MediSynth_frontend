import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Heart, Loader2, Microscope, Stethoscope } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [reportType, setReportType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!file) {
      toast({
        title: "Error",
        description: "Please upload an X-ray image.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      interface UploadResponse {
        predictions: Record<string, number>;
        report: string;
        cam_url: string;
        top_class: string;
      }

      const response = await axios.post<UploadResponse>('http://localhost:5000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = response.data;

      if (!data.predictions || Object.values(data.predictions).every(val => isNaN(val))) {
        throw new Error('Invalid prediction data from server');
      }

      const newReport = {
        id: Date.now().toString(),
        patientName: name,
        patientAge: parseInt(age) || 0,
        patientGender: gender,
        reportType: reportType,
        createdAt: new Date().toISOString(),
        content: response.data.report,
        cam_url: `http://localhost:5000${response.data.cam_url}`,
        predictions: response.data.predictions,
        top_class: response.data.top_class,
      };

      const existingReports = JSON.parse(localStorage.getItem('patientReports') || '[]');
      const updatedReports = [newReport, ...existingReports];
      localStorage.setItem('patientReports', JSON.stringify(updatedReports));

      toast({
        title: "Report generated successfully",
        description: "Your medical report has been created and saved.",
      });

      navigate('/reports');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error generating report",
        description: error.message || "There was a problem creating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 page-transition">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <div className="mr-2">
              <Microscope className="w-6 h-6 text-primary animate-pulse" />
            </div>
            <span className="text-xl font-bold">MediSynth</span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link to="/dashboard" className="font-medium text-primary">Dashboard</Link>
            <Link to="/reports" className="font-medium text-gray-600 hover:text-primary">Reports</Link>
            <Link to="/">
              <Button variant="ghost">Logout</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 animate-fade-in">Generate Medical Report</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle>Patient Information</CardTitle>
                <CardDescription>
                  Enter the patient's details and upload their medical image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Patient Name</label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="age" className="text-sm font-medium">Age</label>
                      <Input
                        id="age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="42"
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="gender" className="text-sm font-medium">Gender</label>
                      <Select value={gender} onValueChange={setGender} required>
                        <SelectTrigger className="form-input">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="Male" className="bg-white text-black hover:bg-gray-100">Male</SelectItem>
                          <SelectItem value="Female" className="bg-white text-black hover:bg-gray-100">Female</SelectItem>
                          <SelectItem value="Other" className="bg-white text-black hover:bg-gray-100">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="reportType" className="text-sm font-medium">Report Type</label>
                      <Select value={reportType} onValueChange={setReportType} required>
                        <SelectTrigger className="form-input">
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xray">X-Ray</SelectItem>
                          {/* <SelectItem value="xray">MRI</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">Address</label>
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Medical Ave, Healthcare City"
                      className="form-input resize-none"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload Medical Image</label>
                    <Input type="file" accept="image/*" onChange={handleFileChange} />
                  </div>
                  
                  <Button type="submit" className="w-full form-button" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Report...
                      </>
                    ) : (
                      'Generate Report'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent report generation activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">No recent activity to display.</p>
                  <Link to="/reports" className="text-primary hover:underline text-sm block mt-4">
                    View all reports →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;