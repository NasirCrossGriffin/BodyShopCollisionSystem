const { Resend } = require("resend");
const express = require('express');
const bodyshop = require("../models/bodyshop");
const router = express.Router()
dotenv = require("dotenv").config();

const resend = new Resend(process.env.RESEND_KEY);

router.post("/estimate/receive", async (req, res) => {
    const email = req.body.email;
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const make = req.body.make;
    const model = req.body.model;
    const year = req.body.year;
    const appointmentDateTime = req.body.appointmentDateTime;
    const bodyShopId = req.body.bodyshop

    const bodyShop = await getBodyshop(bodyShopId);

  try {
        await resend.batch.send([{
        from: bodyShop.displayName + " <no-reply@nasirgriffin.com>",
        to: [bodyShop.email],
        subject: "New Estimate Request Received",
        html: `
        <div style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
            <tr>
                <td align="center">
                <table width="640" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
                    
                    <tr>
                    <td style="padding:24px 28px;background:#111827;color:#ffffff;">
                        <h1 style="margin:0;font-size:20px;">New Estimate Request</h1>
                    </td>
                    </tr>

                    <tr>
                    <td style="padding:24px 28px;color:#111827;">
                        <p style="margin:0 0 16px 0;font-size:14px;">
                        A new estimate request has been submitted through your website.
                        </p>

                        <table width="100%" style="border-collapse:collapse;font-size:13px;">
                        <tr>
                            <td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;width:180px;">Customer Name</td>
                            <td style="padding:8px;border:1px solid #e5e7eb;">
                            ${String(firstName ?? "").trim()} ${String(lastName ?? "").trim()}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Email</td>
                            <td style="padding:8px;border:1px solid #e5e7eb;">
                            ${String(email ?? "").trim()}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;">Vehicle</td>
                            <td style="padding:8px;border:1px solid #e5e7eb;">
                            ${String(year ?? "").trim()} ${String(make ?? "").trim()} ${String(model ?? "").trim()}
                            </td>
                        </tr>
                        </table>

                        <p style="margin-top:18px;font-size:12px;color:#6b7280;">
                        Log into your dashboard to review and respond to this estimate request.
                        </p>
                    </td>
                    </tr>

                    <tr>
                    <td style="padding:18px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
                        ${bodyShop.displayName} Auto Body System Notification
                    </td>
                    </tr>

                </table>
                </td>
            </tr>
            </table>
        </div>
        `,
    },

    {
        from: bodyShop.displayName + " <no-reply@nasirgriffin.com>",
        to: [email],
        subject: "We Received Your Estimate Request",
        html: `<div style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
                    <tr>
                        <td align="center">
                        <table width="640" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
                            
                            <tr>
                            <td style="padding:24px 28px;background:#111827;color:#ffffff;">
                                <h1 style="margin:0;font-size:20px;">Estimate Request Received</h1>
                            </td>
                            </tr>

                            <tr>
                            <td style="padding:24px 28px;color:#111827;">
                                <p style="margin:0 0 16px 0;font-size:14px;">
                                Hi ${String(firstName ?? "").trim() || "there"},
                                </p>

                                <p style="margin:0 0 16px 0;font-size:14px;">
                                Thank you for submitting your estimate request to ${bodyShop.displayName}. 
                                Our team is reviewing your vehicle details and will contact you shortly.
                                </p>

                                <div style="padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
                                <p style="margin:0 0 8px 0;font-size:13px;">
                                    <strong>Vehicle Submitted:</strong>
                                </p>
                                <p style="margin:0;font-size:13px;">
                                    ${String(year ?? "").trim()} ${String(make ?? "").trim()} ${String(model ?? "").trim()}
                                </p>
                                </div>

                                <div style="padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;">
                                <p style="margin:0 0 8px 0;font-size:13px;">
                                    <strong>Appointment Date and Time:</strong>
                                </p>
                                <p style="margin:0;font-size:13px;">
                                    ${appointmentDateTime}
                                </p>
                                </div>

                                <p style="margin-top:18px;font-size:13px;">
                                Please do not reply to this email.
                                </p>
                            </td>
                            </tr>

                            <tr>
                            <td style="padding:18px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
                                This is an automated message from ${bodyShop.displayName}. Please do not share sensitive financial information via email.
                            </td>
                            </tr>

                        </table>
                        </td>
                    </tr>
                    </table>
                </div>`,
            },
        ]);

        res.status(200).json("Contact was successful!");
    } catch (err) {
    console.error(err);
    res.status(500).json("Contact was unsuccessful!");
  }
});

router.post("/estimate/send", async (req, res) => {
    const email = req.body.email;
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const appointmentDateTime = req.body.appointmentDateTime;
    const bodyShopId = req.body.bodyshop
    const price = req.body.price

    const bodyShop = await getBodyshop(bodyShopId);

    console.log(bodyShop);

    // add this helper INSIDE the route (minimal change)
    const formatAppointment = (value) => {
        if (!value) return "";
        const d = new Date(value);
        if (isNaN(d.getTime())) return String(value);

        return d.toLocaleString(undefined, {
            weekday: "short",
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const formattedAppt = formatAppointment(appointmentDateTime);
    const formattedPrice =
    typeof price === "number"
        ? price.toLocaleString(undefined, { style: "currency", currency: "USD" })
        : Number(price).toLocaleString(undefined, { style: "currency", currency: "USD" });

    try {
            await resend.batch.send([{
            from: bodyShop.displayName + " <no-reply@nasirgriffin.com>",
            to: [email],
            subject: "We Received Your Estimate Request",
            html: `<div style="margin:0;padding:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
                    <tr>
                        <td align="center">
                        <table width="640" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
                            
                            <tr>
                            <td style="padding:24px 28px;background:#111827;color:#ffffff;">
                                <h1 style="margin:0;font-size:20px;">Your Estimate Is Ready</h1>
                            </td>
                            </tr>

                            <tr>
                            <td style="padding:24px 28px;color:#111827;">
                                <p style="margin:0 0 14px 0;font-size:14px;line-height:22px;color:#374151;">
                                Hi ${String(firstName ?? "").trim() || "there"}, your estimate from <strong>${String(bodyShop.displayName ?? "").trim()}</strong> has been received.
                                </p>

                                <div style="margin:14px 0 0 0;padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
                                <p style="margin:0 0 8px 0;font-size:13px;line-height:20px;color:#374151;">
                                    <strong style="color:#111827;">Estimated Price:</strong>
                                </p>
                                <p style="margin:0;font-size:18px;line-height:26px;color:#111827;font-weight:700;">
                                    ${formattedPrice}
                                </p>
                                </div>

                                <div style="margin:12px 0 0 0;padding:14px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
                                <p style="margin:0 0 8px 0;font-size:13px;line-height:20px;color:#374151;">
                                    <strong style="color:#111827;">Appointment Date & Time:</strong>
                                </p>
                                <p style="margin:0;font-size:14px;line-height:22px;color:#111827;">
                                    ${String(formattedAppt ?? "").trim()}
                                </p>
                                </div>

                                <p style="margin:14px 0 0 0;font-size:12px;line-height:18px;color:#6b7280;">
                                If you need to reschedule or have questions, please contact ${String(bodyShop.displayName ?? "").trim()} directly.
                                </p>
                            </td>
                            </tr>

                            <tr>
                            <td style="padding:18px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
                                This is an automated update from ${String(bodyShop.displayName ?? "").trim()}.
                            </td>
                            </tr>

                        </table>
                        </td>
                    </tr>
                    </table>
                </div>`,
        }]);
        res.status(200).json("Contact was successful!");
    } catch (err) {
        console.error(err);
        res.status(500).json("Contact was unsuccessful!");
    }
});

//middleware

async function getBodyshop(id) {
  try {
    const doc = await bodyshop.findById(id);
    if (!doc) return null;
    return doc;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = router