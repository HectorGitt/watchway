import { EyeOff, AlertTriangle, Layers } from 'lucide-react';

export function Problem() {
    const problems = [
        {
            icon: EyeOff,
            title: "The Invisible Crisis",
            description: "Thousands of drainage covers are missing and roads are collapsing nationwide, yet there is no central database to track these failures.",
            color: "text-blue-500"
        },
        {
            icon: Layers,
            title: "The Accountability Gap",
            description: "Agencies often pass the buck between Federal and State responsibilities. We provide the proof that ends the excuses.",
            color: "text-orange-500" // Matching primary
        },
        {
            icon: AlertTriangle,
            title: "The Cost of Silence",
            description: "Every unmapped hazard costs lives and destroys vehicles. It’s time to make the invisible, visible.",
            color: "text-red-500" // Danger
        }
    ];

    return (
        <section className="py-32 bg-surface relative overflow-hidden">
            {/* Subtle Glow */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Nigeria Deserves Better Than <span className="text-danger">"Death Traps."</span></h2>
                    <p className="text-xl text-gray-400">The current system thrives on ambiguity. We are building the transparency engine to stop it.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {problems.map((item, idx) => (
                        <div key={idx} className="group p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all duration-300">
                            <div className={`h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center mb-6 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                <item.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
