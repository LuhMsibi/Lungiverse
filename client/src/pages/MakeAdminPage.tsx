import { useState } from "react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { getIdToken } from "@/lib/firebase";

export default function MakeAdminPage() {
  const { user, loading: authLoading } = useFirebaseAuth();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleMakeAdmin = async () => {
    if (!user) {
      setStatus('error');
      setMessage('You must be logged in to make yourself admin');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      // Get Firebase ID token
      const token = await getIdToken();
      
      if (!token) {
        throw new Error('Could not get authentication token');
      }

      // Call make-me-admin endpoint
      const response = await fetch('/api/auth/make-me-admin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to grant admin privileges');
      }

      setStatus('success');
      setMessage('Admin privileges granted! Please sign out and sign back in for changes to take effect.');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'An error occurred');
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6" />
              Admin Setup
            </CardTitle>
            <CardDescription>
              You must be logged in to access this page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/login'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
            Make Yourself Admin
          </CardTitle>
          <CardDescription>
            Grant yourself administrator privileges for this application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border p-4 bg-muted/50">
            <h3 className="font-semibold mb-2">Current Account</h3>
            <p className="text-sm text-muted-foreground">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Name:</strong> {user.displayName || 'Not set'}
            </p>
          </div>

          {status === 'idle' && (
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  After clicking the button below, you'll need to sign out and sign back in 
                  for the admin privileges to take effect.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={handleMakeAdmin}
                className="w-full"
                size="lg"
                data-testid="button-make-admin"
              >
                Make Me Admin
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="flex items-center justify-center gap-2 p-4">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Granting admin privileges...</span>
            </div>
          )}

          {status === 'success' && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">Success!</AlertTitle>
              <AlertDescription className="text-green-700 dark:text-green-300">
                {message}
                <div className="mt-4 space-y-2">
                  <p className="font-semibold">Next steps:</p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Click the "Sign Out" button below</li>
                    <li>Sign back in with the same account</li>
                    <li>Visit the /admin page</li>
                  </ol>
                </div>
                <Button 
                  onClick={() => window.location.href = '/login'} 
                  variant="outline"
                  className="mt-4 w-full"
                >
                  Sign Out Now
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {message}
                <Button 
                  onClick={() => setStatus('idle')} 
                  variant="outline"
                  className="mt-4 w-full"
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Security Note</h3>
            <p className="text-xs text-muted-foreground">
              This page allows any logged-in user to become admin. It's intended for initial setup only. 
              Remove the <code className="px-1 py-0.5 bg-muted rounded">/api/auth/make-me-admin</code> endpoint 
              from your production deployment.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
