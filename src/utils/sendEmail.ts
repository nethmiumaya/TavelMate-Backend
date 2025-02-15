import nodemailer from 'nodemailer';

export const sendSharedLinkEmail = async (toEmail: string, sharedLink: string) => {
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: `"Travel Planner" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Shared Travel Itinerary',
        html: `Access the shared itinerary: <a href="${process.env.CLIENT_URL}/shared/${sharedLink}">View Itinerary</a>`,
    });
};