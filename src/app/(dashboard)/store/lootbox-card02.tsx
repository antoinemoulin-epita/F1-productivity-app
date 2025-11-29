import React from 'react';

interface LootboxCard02Props {
  type?: "bronze" | "silver" | "gold";
  price?: string;
  currency?: string;
  imageUrl?: string;
  onBuy?: () => void;
}

const LootboxCard02 = ({
  type = "bronze",
  price = "500",
  currency = "CR",
  imageUrl = "/silver.png",
  onBuy
}: LootboxCard02Props) => {

  const config = {
    bronze: {
      label: "Bronze Tier",
      badgeClasses: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-200",
      accentBorder: "group-hover:border-orange-300 dark:group-hover:border-orange-400/40",
      buttonClasses: "bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-400",
      cloudColor: "bg-orange-400/[0.08] dark:bg-orange-500/[0.12]"
    },
    silver: {
      label: "Silver Tier",
      badgeClasses: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-200",
      accentBorder: "group-hover:border-slate-400 dark:group-hover:border-slate-500/40",
      buttonClasses: "bg-slate-700 text-white hover:bg-slate-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white",
      cloudColor: "bg-blue-300/[0.06] dark:bg-slate-400/[0.10]"
    },
    gold: {
      label: "Gold Tier",
      badgeClasses: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-200",
      accentBorder: "group-hover:border-yellow-300 dark:group-hover:border-yellow-400/40",
      buttonClasses: "bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400",
      cloudColor: "bg-yellow-400/[0.10] dark:bg-yellow-500/[0.14]"
    }
  };

  const theme = config[type] || config.bronze;

  return (
    <div className={`
      group relative flex flex-col
      w-full max-w-[340px] h-[420px]
      bg-white dark:bg-neutral-900 rounded-[24px] 
      border border-gray-200 dark:border-neutral-700 ${theme.accentBorder}
      shadow-sm hover:shadow-xl hover:-translate-y-1 dark:shadow-none
      transition-all duration-300 ease-out
      overflow-hidden cursor-pointer
    `}>
      
      {/* --- HEADER : Badge & Info --- */}
      <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
        <span className={`
          px-3 py-1 rounded-full 
          text-xs font-semibold tracking-wide uppercase
          ${theme.badgeClasses}
        `}>
          {theme.label}
        </span>
        
        {/* Icône d'info discrète */}
        <button className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-white transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        </button>
      </div>

      {/* --- ZONE VISUELLE (VITRINE) --- */}
      <div className="flex-1 relative flex items-center justify-center bg-gradient-to-b from-gray-100 to-gray-200/50 dark:from-neutral-900 dark:to-neutral-950">
        
        {/* Nuages de couleur subtils - apparaissent au hover */}
        <div className={`absolute top-8 left-12 w-40 h-40 ${theme.cloudColor} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
        <div className={`absolute bottom-12 right-16 w-32 h-32 ${theme.cloudColor} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* L'IMAGE 3D */}
        <div className="relative w-64 h-48 transition-transform duration-500 group-hover:scale-105 ease-in-out">
            <img 
              src={imageUrl} 
              alt={`${type} lootbox`} 
              className="w-full h-full object-contain drop-shadow-2xl"
            />
        </div>
      </div>

      {/* --- FOOTER : Détails & Action --- */}
      <div className="p-6 pt-2 bg-white dark:bg-neutral-900 flex flex-col gap-4">
        
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Capsule {type.charAt(0).toUpperCase() + type.slice(1)}
          </h3>
          <p className="text-sm text-slate-600 dark:text-neutral-300 mt-1 font-medium leading-relaxed">
            Contient des éléments cosmétiques rares et des améliorations de performance.
          </p>
        </div>

        {/* Ligne de séparation subtile */}
        <div className="h-px w-full bg-gray-200 dark:bg-neutral-800"></div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{price}</span>
            <span className="text-sm font-semibold text-slate-500 dark:text-neutral-400">{currency}</span>
          </div>

          <button 
            onClick={onBuy}
            className={`
              ${theme.buttonClasses}
              px-6 py-2.5 rounded-xl
              text-sm font-semibold shadow-sm
              transition-all duration-300
              hover:shadow-md active:scale-95
              flex items-center gap-2
            `}
          >
            Obtenir
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LootboxCard02;