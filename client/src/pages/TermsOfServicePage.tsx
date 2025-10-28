import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8" data-testid="text-terms-title">Terms of Service</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Last Updated: January 2025</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground">
              Welcome to Lungiverse! These Terms of Service ("Terms") govern your access to and use of lungiverse.com (the "Website") and all related services (collectively, the "Services") provided by Lungiverse ("we," "us," or "our"). By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy.
            </p>
            <p className="text-muted-foreground mt-4">
              If you do not agree to these Terms, you may not access or use our Services. We reserve the right to modify these Terms at any time. Your continued use of the Services after such modifications constitutes your acceptance of the updated Terms. We will notify you of any material changes by updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Description of Services</h2>
            <p className="text-muted-foreground">
              Lungiverse is a comprehensive platform for discovering, comparing, and utilizing AI tools and conversion utilities. Our Services include:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li>A curated directory of 250+ AI tools across multiple categories including Conversion, Image AI, Text AI, Video AI, Audio AI, and Code AI</li>
              <li>Intelligent search functionality to help you find the right tools for your needs</li>
              <li>AI-powered chatbot assistant for personalized tool recommendations</li>
              <li>Educational articles and resources about AI tools and best practices</li>
              <li>User account features including favorites and personalized recommendations</li>
              <li>Community ratings and reviews to help you make informed decisions</li>
              <li>Analytics-driven rankings to showcase popular and trending tools</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We reserve the right to modify, suspend, or discontinue any part of our Services at any time without prior notice. We may also impose limits on certain features or restrict your access to parts or all of the Services without liability.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Accounts and Registration</h2>
            <p className="text-muted-foreground">
              To access certain features of our Services, you may need to create an account using Replit authentication. When you create an account, you agree to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your account information to keep it accurate and current</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Not share your account credentials with others</li>
              <li>Not create multiple accounts or impersonate others</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We reserve the right to suspend or terminate your account at any time if we believe you have violated these Terms or engaged in any fraudulent, abusive, or illegal activity.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptable Use Policy</h2>
            <p className="text-muted-foreground">
              You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree NOT to:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li>Violate any applicable laws, regulations, or third-party rights</li>
              <li>Use the Services for any fraudulent, harmful, or illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems, servers, or networks</li>
              <li>Interfere with or disrupt the operation of our Services or servers</li>
              <li>Use automated systems (bots, scrapers, crawlers) to access our Services without permission</li>
              <li>Transmit viruses, malware, or any other malicious code</li>
              <li>Harass, abuse, threaten, or intimidate other users</li>
              <li>Post or transmit spam, unsolicited messages, or promotional content</li>
              <li>Infringe on intellectual property rights of Lungiverse or third parties</li>
              <li>Collect or harvest personal information about other users</li>
              <li>Reverse engineer, decompile, or disassemble any part of our Services</li>
              <li>Remove or modify any copyright, trademark, or proprietary notices</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Violation of this Acceptable Use Policy may result in immediate termination of your access to our Services and potential legal action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property Rights</h2>
            <p className="text-muted-foreground">
              The Services and all content, features, and functionality (including but not limited to text, graphics, logos, icons, images, audio clips, data compilations, and software) are owned by Lungiverse, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-muted-foreground mt-4">
              You are granted a limited, non-exclusive, non-transferable, revocable license to access and use our Services for your personal, non-commercial use. This license does not include:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li>The right to use our Services for commercial purposes without our written permission</li>
              <li>The right to modify, copy, distribute, transmit, display, reproduce, or create derivative works</li>
              <li>The right to use our trademarks, logos, or branding without authorization</li>
              <li>The right to frame or mirror any part of our Services on another website</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              The "Lungiverse" name and logo are trademarks of Lungiverse. All other product and company names mentioned on our Website may be trademarks of their respective owners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User-Generated Content</h2>
            <p className="text-muted-foreground">
              Our Services may allow you to submit, post, or share content such as reviews, ratings, comments, and favorites ("User Content"). By submitting User Content, you:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li>Grant us a worldwide, non-exclusive, royalty-free, perpetual, irrevocable license to use, reproduce, modify, adapt, publish, and display your User Content</li>
              <li>Represent that you own or have the necessary rights to submit the User Content</li>
              <li>Warrant that your User Content does not violate any third-party rights or applicable laws</li>
              <li>Agree that your User Content will not contain defamatory, obscene, offensive, or illegal material</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We reserve the right to remove any User Content that violates these Terms or that we find objectionable for any reason. We are not responsible for any User Content posted by you or other users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Links and Tools</h2>
            <p className="text-muted-foreground">
              Our Services contain links to third-party websites and information about third-party AI tools that are not owned or controlled by Lungiverse. We do not endorse or assume responsibility for the content, privacy policies, or practices of any third-party websites or services.
            </p>
            <p className="text-muted-foreground mt-4">
              The inclusion of any tool in our directory does not constitute an endorsement or recommendation. We provide information about these tools for educational and informational purposes only. You acknowledge and agree that:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li>We are not responsible for the availability, accuracy, or reliability of third-party tools</li>
              <li>We are not liable for any damages or losses arising from your use of third-party tools</li>
              <li>You should review the terms of service and privacy policies of any third-party tools before using them</li>
              <li>Any transactions or interactions you have with third-party tool providers are solely between you and them</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We strongly advise you to review the terms and conditions and privacy policies of any third-party websites or services that you visit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Disclaimer of Warranties</h2>
            <p className="text-muted-foreground">
              OUR SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li>WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT</li>
              <li>WARRANTIES REGARDING THE ACCURACY, RELIABILITY, OR COMPLETENESS OF CONTENT</li>
              <li>WARRANTIES THAT THE SERVICES WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE</li>
              <li>WARRANTIES THAT DEFECTS WILL BE CORRECTED OR THAT THE SERVICES ARE FREE OF VIRUSES</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We do not warrant that the information provided about AI tools is complete, accurate, or up-to-date. Tool features, pricing, and availability may change without notice. You use our Services and any third-party tools at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <p className="text-muted-foreground">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL LUNGIVERSE, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li>Loss of profits, revenue, data, or use</li>
              <li>Business interruption or loss of goodwill</li>
              <li>Damages resulting from your use or inability to use the Services</li>
              <li>Damages arising from third-party tools or websites</li>
              <li>Unauthorized access to or alteration of your data</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THESE TERMS OR THE SERVICES SHALL NOT EXCEED $100 USD OR THE AMOUNT YOU PAID US IN THE PAST 12 MONTHS, WHICHEVER IS GREATER.
            </p>
            <p className="text-muted-foreground mt-4">
              Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities, so some of the above limitations may not apply to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to defend, indemnify, and hold harmless Lungiverse, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or expenses (including attorney's fees) arising from:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li>Your use of or access to the Services</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights, including intellectual property or privacy rights</li>
              <li>Your User Content or any content you submit</li>
              <li>Your fraudulent, harmful, or illegal activities</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              We reserve the right to assume the exclusive defense and control of any matter subject to indemnification by you, and you agree to cooperate with our defense of these claims.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Governing Law and Dispute Resolution</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or your use of the Services shall be resolved through binding arbitration in accordance with the American Arbitration Association's rules.
            </p>
            <p className="text-muted-foreground mt-4">
              You agree to waive your right to participate in class action lawsuits or class-wide arbitration. Any arbitration shall be conducted on an individual basis. If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Termination</h2>
            <p className="text-muted-foreground">
              We may terminate or suspend your access to our Services immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 text-muted-foreground">
              <li>Your right to use the Services will immediately cease</li>
              <li>We may delete your account and any associated data</li>
              <li>You must cease all use of our Services and delete any downloaded materials</li>
              <li>Provisions regarding intellectual property, disclaimers, limitation of liability, and indemnification shall survive termination</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">General Provisions</h2>
            <p className="text-muted-foreground">
              <strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy, constitute the entire agreement between you and Lungiverse regarding the use of our Services.
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Waiver:</strong> Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Severability:</strong> If any provision of these Terms is held to be invalid or unenforceable, the remaining provisions will remain in full force and effect.
            </p>
            <p className="text-muted-foreground mt-4">
              <strong>Assignment:</strong> You may not assign or transfer these Terms or your account without our prior written consent. We may assign our rights and obligations without restriction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="font-semibold">Lungiverse</p>
              <p className="text-muted-foreground">Email: legal@lungiverse.com</p>
              <p className="text-muted-foreground">Contact Form: <a href="/contact" className="text-primary hover:underline">lungiverse.com/contact</a></p>
            </div>
            <p className="text-muted-foreground mt-4">
              We will respond to all legitimate inquiries within a reasonable timeframe.
            </p>
          </section>

          <section className="mt-8 p-6 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Acknowledgment:</strong> By using Lungiverse, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these Terms, you must not access or use our Services.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
