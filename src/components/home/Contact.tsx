import React, { useState } from 'react';

const ContactPerson: React.FC<{ name: string, title: string, industry: string, details: React.ReactNode, photo: string }> = ({ name, title, industry, details, photo }) => {
    const [imgSrc, setImgSrc] = useState(photo);

    return (
        <div className="bg-[rgba(6,32,58,0.6)] backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:border-[#c5a47e]/30 transition-all duration-300 group">
            <div className="w-40 h-40 rounded-full border-2 border-[#c5a47e] p-1 mb-6 relative group-hover:scale-105 transition-transform duration-500">
                <img
                    src={imgSrc}
                    alt={name}
                    className="w-full h-full rounded-full object-cover bg-[#06203a]"
                    onError={() => setImgSrc('/images/assets/logo/EverShine-logo.png')}
                />
            </div>
            <h3 className="text-xl font-bold text-[#c5a47e] mb-1">{title}</h3>
            <div className="text-2xl font-bold text-white mb-2">{name}</div>
            <div className="px-4 py-1.5 bg-[#c5a47e]/10 rounded-full text-[#c5a47e] text-sm font-medium mb-6 inline-block border border-[#c5a47e]/20">
                {industry}
            </div>

            <div className="space-y-3 text-gray-300 w-full border-t border-white/10 pt-6 text-sm md:text-base">
                {details}
            </div>
        </div>
    );
};

const Contact: React.FC = () => {
    return (
        <section id="contact" className="py-24 relative z-10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#c5a47e]">聯絡我們</h2>
                    <div className="w-16 h-1 bg-[#c5a47e] mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    <ContactPerson
                        name="王年煜"
                        title="現任主席"
                        industry="AI程式交易"
                        photo="/images/members/王年煜.jpg"
                        details={
                            <>
                                <p className="flex justify-center gap-2"><strong className="text-white min-w-[70px] text-right">職位：</strong>主席</p>
                                <p className="flex justify-center gap-2"><strong className="text-white min-w-[70px] text-right">聯絡方式：</strong>待確認</p>
                            </>
                        }
                    />
                    <ContactPerson
                        name="王祈"
                        title="現任副主席"
                        industry="AI學習整合"
                        photo="/images/members/王祈.jpg"
                        details={
                            <>
                                <p className="flex justify-center gap-2"><strong className="text-white min-w-[70px] text-right">職位：</strong>副主席</p>
                                <p className="flex justify-center gap-2"><strong className="text-white min-w-[70px] text-right">Email：</strong><a href="mailto:samuel900731@gmail.com" className="hover:text-[#c5a47e] transition-colors">samuel900731@gmail.com</a></p>
                                <p className="flex justify-center gap-2"><strong className="text-white min-w-[70px] text-right">Instagram：</strong><a href="https://instagram.com/samuel_wang0731" target="_blank" rel="noopener noreferrer" className="hover:text-[#c5a47e] transition-colors">@samuel_wang0731</a></p>
                            </>
                        }
                    />
                </div>
            </div>
        </section>
    );
};

export default Contact;
