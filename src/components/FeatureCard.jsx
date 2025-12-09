import React from 'react';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="glass-card p-5 group hover:border-primary/30 transition-all duration-300">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
