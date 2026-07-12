/**
 * Real Email Service for AssetFlow ERP using local Node.js Backend
 */
export const emailService = {
  /**
   * Sends an OTP to a user's email address for registration via local backend.
   */
  sendOTP: async (email, otpCode) => {
    try {
      const response = await fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Backend Success:', data.message);
        return { success: true, message: `OTP sent to ${email}` };
      } else {
        console.error('Backend Error:', data.message);
        return { success: false, message: data.message };
      }
      
    } catch (error) {
      console.error('Fetch Error:', error);
      console.log(`[DEV MODE] OTP Generated: ${otpCode} (Backend not running)`);
      return { success: true, message: `[DEV] OTP is ${otpCode}. Start the server.js to receive real emails!` };
    }
  },

  /**
   * Simulates sending an approval notification email to an admin.
   */
  sendAdminApprovalRequest: async (adminEmail, newUser) => {
    console.log(`[Admin Notification]: User ${newUser.email} is pending approval.`);
    return { success: true };
  },

  /**
   * Sends a welcome/approval email to a newly approved user via local backend.
   */
  sendUserApprovalNotification: async (userEmail, roleAssigned) => {
    try {
      const response = await fetch('http://localhost:5000/api/send-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail, role: roleAssigned }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('Backend Success:', data.message);
        return { success: true, message: `Approval email sent to ${userEmail}` };
      } else {
        console.error('Backend Error:', data.message);
        return { success: false, message: data.message };
      }
      
    } catch (error) {
      console.error('Fetch Error:', error);
      return { success: false, message: 'Failed to send approval email' };
    }
  }
};
