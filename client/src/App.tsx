import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FirebaseAuthProvider } from "@/hooks/useFirebaseAuth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatBot } from "@/components/ChatBot";
import HomePage from "@/pages/HomePage";
import ToolsDirectory from "@/pages/ToolsDirectory";
import ToolDetailPage from "@/pages/ToolDetailPage";
import ArticlesPage from "@/pages/ArticlesPage";
import ArticleDetailPage from "@/pages/ArticleDetailPage";
import AboutPage from "@/pages/AboutPage";
import Favorites from "@/pages/Favorites";
import AdminPage from "@/pages/AdminPage";
import AdminSeedPage from "@/pages/AdminSeedPage";
import ContactPage from "@/pages/ContactPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/login" component={AuthPage} />
      <Route path="/tools" component={ToolsDirectory} />
      <Route path="/tool/:id" component={ToolDetailPage} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/articles" component={ArticlesPage} />
      <Route path="/article/:slug" component={ArticleDetailPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/privacy" component={PrivacyPolicyPage} />
      <Route path="/terms" component={TermsOfServicePage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/seed" component={AdminSeedPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FirebaseAuthProvider>
        <TooltipProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <ChatBot />
          <Toaster />
        </TooltipProvider>
      </FirebaseAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
