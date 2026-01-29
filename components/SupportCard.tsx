import React from 'react';
import { Clock, RefreshCw, Heart } from 'lucide-react';

interface SupportCardProps {
  type: 'immediate' | 'structural' | 'emotional';
  content: string;
}

const SupportCard: React.FC<SupportCardProps> = ({ type, content }) => {
  const getConfig = () => {
    switch (type) {
      case 'immediate':
        return {
          icon: <Clock className="w-5 h-5 text-teal-600" />,
          title: "Immediate Relief",
          bgColor: "bg-teal-50",
          borderColor: "border-teal-100",
          textColor: "text-teal-900"
        };
      case 'structural':
        return {
          icon: <RefreshCw className="w-5 h-5 text-indigo-600" />,
          title: "Structural Adjustment",
          bgColor: "bg-indigo-50",
          borderColor: "border-indigo-100",
          textColor: "text-indigo-900"
        };
      case 'emotional':
        return {
          icon: <Heart className="w-5 h-5 text-rose-600" />,
          title: "Emotional Reframe",
          bgColor: "bg-rose-50",
          borderColor: "border-rose-100",
          textColor: "text-rose-900"
        };
    }
  };

  const config = getConfig();

  return (
    <div className={`p-5 rounded-xl border ${config.bgColor} ${config.borderColor} transition-all hover:shadow-sm`}>
      <div className="flex items-center gap-2 mb-3">
        {config.icon}
        <h3 className={`font-medium ${config.textColor}`}>{config.title}</h3>
      </div>
      <p className="text-slate-700 leading-relaxed text-sm md:text-base">
        {content}
      </p>
    </div>
  );
};

export default SupportCard;