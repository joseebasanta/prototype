import * as React from "react";
import { BalanceTicker, type BalanceTickerProps } from "./BalanceTicker";

/**
 * Demo wrapper: the dark wallet card (ported from the wallet-wave prototype)
 * with the animated balance dropped into place. The three colored cards keep
 * the soft, always-on wave (pure CSS) for visual continuity.
 */
export function WalletCard({
  balance = 420,
  ...tickerProps
}: { balance?: number } & Omit<BalanceTickerProps, "balance">) {
  return (
    <div className="wallet-scale">
      <div
        className="wallet"
        role="img"
        aria-label={`Digital wallet, total balance ${balance.toFixed(2)} dollars`}
      >
        {/* back panel */}
        <div className="wallet-layer wallet-back" aria-hidden="true">
          <svg viewBox="0 0 200 126" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="126" rx="16" fill="#2B2B2B" />
          </svg>
        </div>

        {/* inner cards (soft wave) */}
        <div className="cards" aria-hidden="true">
          <div className="card card--blue">
            <div className="card__inner">
              <svg viewBox="0 0 192 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="192" height="85" rx="12" fill="#335CFF" />
              </svg>
            </div>
          </div>
          <div className="card card--green">
            <div className="card__inner">
              <svg viewBox="0 0 192 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="192" height="84" rx="12" fill="#1FC16B" />
              </svg>
            </div>
          </div>
          <div className="card card--yellow">
            <div className="card__inner">
              <svg viewBox="0 0 192 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="192" height="85" rx="12" fill="#F6B51E" />
              </svg>
            </div>
          </div>
        </div>

        {/* front pocket */}
        <div className="wallet-layer wallet-front" aria-hidden="true">
          <svg viewBox="0 0 200 92" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#fi)">
              <path
                d="M16 92H184C192.837 92 200 84.8365 200 76V9.91135H176.439C173.478 9.91135 170.575 9.08963 168.053 7.53764L159.662 2.37372C157.14 0.821728 154.237 0 151.276 0H44.9784C42.0173 0 39.1142 0.821729 36.5924 2.37372L28.2016 7.53763C25.6798 9.08962 22.7768 9.91135 19.8156 9.91135H0V76C0 84.8366 7.16344 92 16 92Z"
                fill="#171717"
              />
              <path
                d="M16 92H184C192.837 92 200 84.8365 200 76V9.91135H176.439C173.478 9.91135 170.575 9.08963 168.053 7.53764L159.662 2.37372C157.14 0.821728 154.237 0 151.276 0H44.9784C42.0173 0 39.1142 0.821729 36.5924 2.37372L28.2016 7.53763C25.6798 9.08962 22.7768 9.91135 19.8156 9.91135H0V76C0 84.8366 7.16344 92 16 92Z"
                fill="url(#pg)"
                fillOpacity="0.16"
              />
            </g>
            <defs>
              <filter
                id="fi"
                x="0"
                y="0"
                width="200"
                height="96"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="2" />
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
              </filter>
              <linearGradient id="pg" x1="100" y1="0" x2="100" y2="92" gradientUnits="userSpaceOnUse">
                <stop stopColor="white" />
                <stop offset="1" stopColor="white" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* balance */}
        <div className="balance">
          <BalanceTicker balance={balance} className="balance__amount" {...tickerProps} />
          <div className="balance__label">Total Balance</div>
        </div>
      </div>
    </div>
  );
}
