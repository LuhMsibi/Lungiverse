import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8" data-testid="text-privacy-title">Privacy Policy</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Last Updated: January 2025</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-muted-foreground">
              Welcome to Lungiverse ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website lungiverse.com and use our services.
            </p>
            <p className="text-muted-foreground mt-4">
              By accessing or using Lungiverse, you agree to the terms outlined in this Privacy Policy. If you do not agree with our policies and practices, please do not use our services. We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-2 mt-4">Personal Information</h3>
            <p className="text-muted-foreground">
              When you create an account or use our services, we may collect personal information that you voluntarily provide to us, including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li>Name and email address (when you sign in with Replit)</li>
              <li>Profile information from your Replit account</li>
              <li>Your favorite tools and preferences when you use our platform</li>
              <li>Messages you send through our AI chatbot assistant</li>
              <li>Any information you provide when contacting us</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">Automatically Collected Information</h3>
            <p className="text-muted-foreground">
              When you visit Lungiverse, we automatically collect certain information about your device and browsing actions, including:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li>IP address and browser type</li>
              <li>Operating system and device information</li>
              <li>Pages you view and links you click</li>
              <li>Time spent on pages and website usage patterns</li>
              <li>Referring website addresses</li>
              <li>Cookie data and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2 mt-4">Analytics and Advertising Information</h3>
            <p className="text-muted-foreground">
              We use Google Analytics to understand how visitors interact with our website. Google Analytics collects information such as how often users visit our site, what pages they visit, and what other sites they used prior to coming to our site. We use this information to improve our website and services.
            </p>
            <p className="text-muted-foreground mt-4">
              We also use Google AdSense to display advertisements on our website. Google AdSense may use cookies and web beacons to serve ads based on your prior visits to our website or other websites. You can opt out of personalized advertising by visiting Google's Ads Settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use the information we collect in the following ways:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li><strong>Provide and maintain our services:</strong> To create and manage your account, provide access to our AI tools directory, and enable chatbot functionality</li>
              <li><strong>Personalize your experience:</strong> To remember your favorite tools, preferences, and provide personalized recommendations</li>
              <li><strong>Improve our services:</strong> To analyze usage patterns, identify trends, and enhance our website's functionality and user experience</li>
              <li><strong>Communicate with you:</strong> To respond to your inquiries, send important updates, and provide customer support</li>
              <li><strong>Display relevant advertisements:</strong> To show you ads that may be of interest to you through Google AdSense</li>
              <li><strong>Ensure security:</strong> To detect, prevent, and address technical issues, fraudulent activity, and violations of our Terms of Service</li>
              <li><strong>Comply with legal obligations:</strong> To fulfill any legal requirements or respond to lawful requests from authorities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-muted-foreground">
              Lungiverse uses cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device that help us remember your preferences and understand how you use our website.
            </p>
            <p className="text-muted-foreground mt-4">
              We use the following types of cookies:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li><strong>Essential Cookies:</strong> Necessary for the website to function properly, including authentication and security</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website through Google Analytics</li>
              <li><strong>Advertising Cookies:</strong> Used by Google AdSense to display relevant advertisements</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences, such as your favorite tools</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground">
              We work with trusted third-party service providers to help us operate our website and provide our services:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li><strong>Replit:</strong> For user authentication and account management</li>
              <li><strong>OpenAI:</strong> To power our AI chatbot assistant that helps you discover relevant tools</li>
              <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior</li>
              <li><strong>Google AdSense:</strong> To display advertisements on our website</li>
              <li><strong>Neon Database:</strong> To securely store and manage your data</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              These third parties have access to your information only to perform specific tasks on our behalf and are obligated to protect your information and use it only for the purposes we specify. We are not responsible for the privacy practices of these third-party services, and we encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li>Encryption of data in transit using SSL/TLS protocols</li>
              <li>Secure authentication through Replit's OAuth system</li>
              <li>Regular security assessments and updates</li>
              <li>Restricted access to personal information on a need-to-know basis</li>
              <li>Secure database storage with Neon Database</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Privacy Rights</h2>
            <p className="text-muted-foreground">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li><strong>Access:</strong> You can request access to the personal information we hold about you</li>
              <li><strong>Correction:</strong> You can request that we correct any inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> You can request that we delete your personal information, subject to certain legal obligations</li>
              <li><strong>Data Portability:</strong> You can request a copy of your data in a structured, commonly used format</li>
              <li><strong>Opt-Out:</strong> You can opt out of receiving marketing communications or personalized advertising</li>
              <li><strong>Object:</strong> You can object to our processing of your personal information in certain circumstances</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              To exercise any of these rights, please contact us using the information provided in the "Contact Us" section below. We will respond to your request within a reasonable timeframe as required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground">
              Lungiverse is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately. If we become aware that we have collected personal information from a child under 13 without parental consent, we will take steps to remove that information from our servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
            <p className="text-muted-foreground">
              Your information may be transferred to and maintained on computers located outside of your state, province, country, or other governmental jurisdiction where data protection laws may differ. By using Lungiverse, you consent to the transfer of your information to the United States and other countries where our service providers operate.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes, we will update the "Last Updated" date at the top of this page. We encourage you to review this Privacy Policy periodically to stay informed about how we are protecting your information. Your continued use of Lungiverse after any changes indicates your acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-semibold">Lungiverse</p>
              <p className="text-muted-foreground">Email: privacy@lungiverse.com</p>
              <p className="text-muted-foreground">Contact Form: <a href="/contact" className="text-primary hover:underline">lungiverse.com/contact</a></p>
            </div>
            <p className="text-muted-foreground mt-4">
              We take your privacy seriously and will respond to all legitimate requests within 30 days or as required by applicable law.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
