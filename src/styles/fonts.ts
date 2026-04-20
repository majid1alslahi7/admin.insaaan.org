import { Montserrat, Poppins, Cairo } from 'next/font/google';
export const montserrat = Montserrat({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-montserrat', display: 'swap' });
export const poppins = Poppins({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-poppins', display: 'swap' });
export const cairo = Cairo({ subsets: ['arabic'], weight: ['400','500','600','700'], variable: '--font-cairo', display: 'swap' });
export const allFontVariables = [montserrat.variable, poppins.variable, cairo.variable].join(' ');
