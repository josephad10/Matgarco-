/**
 * Stub Email Service (Caveman Implementation)
 */

export const sendEmail = async (options: { to: string; subject: string; html: string }): Promise<boolean> => {
  console.log(`[EMAIL STUB] Sending to: ${options.to}`);
  console.log(`[EMAIL STUB] Subject: ${options.subject}`);
  return true;
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<boolean> => {
  return sendEmail({
    to: email,
    subject: 'Welcome to Matgarco!',
    html: `<p>Hello ${name}, welcome to Matgarco!</p>`,
  });
};

export const sendOrderConfirmation = async (email: string, orderNum: string): Promise<boolean> => {
  return sendEmail({
    to: email,
    subject: `Order Confirmation #${orderNum}`,
    html: `<p>Your order #${orderNum} has been confirmed.</p>`,
  });
};
