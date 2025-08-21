import "../../Css/UI/ContactForm.css"
import TextField from "@mui/material/TextField";
import  emailImage  from "../../images/Email_Image.png"
import Button from "@mui/material/Button";
import { HiOutlineMail } from "react-icons/hi";
import { FiPhone } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import * as React from "react";
import {z} from "zod";
import {SubmitHandler, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import emailjs from '@emailjs/browser';
import {useState} from "react";

const contactInputSchema = z.object({
    contactName: z.string().nonempty("Must enter a name"),
    contactEmail: z.string().email("Must enter a valid email"),
    contactMessage: z.string().max(400, "Max character count is 400").nonempty("Must add a message")
});

type contactFormInputFormData = z.infer<typeof contactInputSchema>;


export const ContactForm = () => {
    const [formStatus, setFormStatus] = useState({ message: '', type: '' });

    const {register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<contactFormInputFormData>({
        resolver: zodResolver(contactInputSchema)
    })

    const emailJsService = async ({ contactName, contactEmail, contactMessage }: contactFormInputFormData) => {
        try {
            await emailjs.send(
                'service_svq63ol',
                'template_8vt8akm',
                { contactName, contactEmail, contactMessage },
                'lmexi5prPdvJBSrD7'
            );
            setFormStatus({
                message: 'Message Sent Successfully',
                type: 'success',
            });
        } catch (error: any) {
            setFormStatus({
                message: `Message failed to send: ${error.text || 'Unknown error'}`,
                type: 'error',
            });
        }
    };

    const onSubmit: SubmitHandler<contactFormInputFormData> = (data) => {
        emailJsService(data).then(r => console.log(r));
        reset();
    }

    return (
        <>
            <div className="contactForm-container">
                <div className="contact-details">
                    <div className="contact-details-header-section">
                        <h2>Get in Touch</h2>
                        <p>Ready to elevate your projects? Let's collaborate and make it happen – easily and efficiently.</p>
                    </div>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="contactForm-details-section">
                        <TextField
                            {...register('contactName')}
                            id="yourName"
                            label="Your Name"
                            variant="outlined"
                            size="medium"
                            fullWidth
                            error={!!errors.contactName}
                            helperText={errors.contactName?.message}
                        />
                        <TextField
                            {...register('contactEmail')}
                            id="yourEmail"
                            label="Your Email"
                            variant="outlined"
                            size="medium"
                            fullWidth
                            error={!!errors.contactEmail}
                            helperText={errors.contactEmail?.message}
                        />
                        <TextField
                            {...register('contactMessage')}
                            id="yourMessage"
                            label="message"
                            variant="outlined"
                            size="medium"
                            fullWidth
                            multiline
                            rows={15}
                            error={!!errors.contactMessage}
                            helperText={errors.contactMessage?.message}
                        />
                        <div className="contactForm-button-container">
                            <Button type="submit" variant="contained">
                                Search Carpet
                            </Button>
                        </div>
                    </form>
                </div>
                <div className="contact-location-details">
                        <img src={emailImage} alt="Enverlope"/>
                        <div className="contact-location-info-section">
                            <div className="contact-location-info">
                                <HiOutlineMail/>
                                <p> ChamanRugs@gmail.com</p>
                            </div>
                            <div className="contact-location-info">
                                <FiPhone/>
                                <p>(516) 883-1717</p>
                            </div>
                            <div className="contact-location-info">
                                <IoLocationOutline/>
                                <p>650 Port Washington Blvd, Port Washington, NY 11050</p>
                            </div>
                        </div>
                </div>
            </div>
        </>
    );
};
