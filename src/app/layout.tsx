import type { Metadata } from 'next';
import { Manrope, Inter } from 'next/font/google';
import '../styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { getSiteContent } from '@/lib/site-content';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Jama Tech LTD | Innovating for a Sustainable, Connected & Resilient Future',
    template: '%s | Jama Tech LTD',
  },
  description: 'Jama Tech LTD is a South Sudanese social enterprise operating across food & non-food items supply, plastic waste recycling, ICT consultancy, and internet infrastructure & web development.',
};

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const siteContent = await getSiteContent();
  const serviceLinks = siteContent.services.map((service) => ({ name: service.title, href: `/services/${service.slug}` }));

  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        <Header companyName={siteContent.company.name} location={siteContent.company.location} navigation={siteContent.navigation} />
        <main>{children}</main>
        <Footer company={siteContent.company} services={serviceLinks} navigation={siteContent.navigation} />
      </body>
    </html>
  );
}
