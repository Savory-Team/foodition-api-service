class HTMLTemplateEmail {
    static RegisterHTML = (OTP) => {
        return `<body style="font-family: 'Arial', sans-serif; background-color: #f5f5f5; text-align: center; margin: 0; padding: 0;">
            <div class="container"
                style="max-width: 100%; margin: 50px auto; background-color: #ffffff; text-align: center; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h1>Terima kasih sudah mendaftar di Foodition</h1>
                <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Kode verifikasi akun anda
                    adalah</p>
                <p
                    style="display: inline-block; padding: 10px 20px; text-decoration: none; background-color: #386FA4; color: #ffffff; font-weight: bold; border-radius: 4px;">
                    ${OTP}</p>
            </div>
        </body>`
    }

    static GetOTPTemplate = (OTP) => {
        return `<body style="font-family: 'Arial', sans-serif; background-color: #f5f5f5; text-align: center; margin: 0; padding: 0;">
            <div class="container"
                style="max-width: 100%; margin: 50px auto; background-color: #ffffff; text-align: center; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <h1>Foodition OTP</h1>
                <p style="color: #666666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Kode OTP anda adalah</p>
                <p
                    style="display: inline-block; padding: 10px 20px; text-decoration: none; background-color: #386FA4; color: #ffffff; font-weight: bold; border-radius: 4px;">
                    ${OTP}</p>
            </div>
        </body>`
    }
}

module.exports = HTMLTemplateEmail