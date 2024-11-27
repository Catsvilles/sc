import { BOT_TOKEN, CHAT_ID } from '$env/static/private';
import type { Actions } from "./$types";

export const actions: Actions = {
    default: async ({ request, getClientAddress }) => {
        const formData = await request.formData();
        const email = formData.get('email')?.toString();
        const name = formData.get('name')?.toString();
        const message = formData.get('message')?.toString();
        const submissionTime = formData.get('submissionTime')?.toString();
        const clientIP = getClientAddress();

        // Validate required fields
        if (!email || !name || !message || !submissionTime) {
            return { success: false, error: 'All fields are required' };
        }

        // Time validation
        const timeDifference = Date.now() - Number(submissionTime);
        const minimumSubmissionTime = 3000; // 3 seconds

        if (timeDifference < minimumSubmissionTime) {
            return { 
                success: false, 
                error: 'Form submitted too quickly. Please try again.' 
            };
        }

        const url = `https://api.secret.org/bot${BOT_TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=
        AGENCY:
        Name:${name} 
        Email:${email} 
        Message:${message}
        IP: ${clientIP}

        `;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to send message');
            }
            return { success: true };
        } catch (error) {
            console.error('Error:', error);
            return { 
                success: false, 
                error: 'Failed to send message. Please try again later.' 
            };
        }
    }
};

export const prerender = false;