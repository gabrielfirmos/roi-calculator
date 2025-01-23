"use client";
import React, { useState, useEffect, useRef } from "react";
import { Info } from 'lucide-react';

// Brand Colors - Fixed regardless of system theme
const colors = {
  vampireBlack: '#08090A',
  cultured: '#F7F8F8',
  argent: '#C0C0C0',
  gray: {
    400: '#747474',
    500: '#444545',
    600: '#8C8C8C',
  }
};

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const contentRef = useRef(null);

  useEffect(() => {
    const sendHeight = () => {
      if (contentRef.current) {
        const height = contentRef.current.scrollHeight;
        window.parent.postMessage({ 
          type: "resize", 
          height: height + 50
        }, "*");
      }
    };
  
    const observer = new ResizeObserver(sendHeight);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }
  
    return () => observer.disconnect();
  }, [activeTab]);
  
  return (
    <div 
      ref={contentRef}
      className="min-h-screen"
      style={{ 
        fontFamily: 'Inter, sans-serif', 
        backgroundColor: 'transparent',
        isolation: 'isolate'
      }}
    >
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        <div className="space-y-8">
          <div className="flex justify-center gap-4">
            {['pipeline', 'time'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`group relative px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105
                  ${activeTab === tab ? 'shadow-lg' : ''}`}
                style={{
                  backgroundColor: activeTab === tab ? colors.vampireBlack : 'rgba(8, 9, 10, 0.2)',
                  color: activeTab === tab ? colors.cultured : colors.vampireBlack
                }}
              >
                {tab === 'pipeline' ? 'Pipeline Value' : 'Time Savings'}
                <div 
                  className={`absolute left-0 bottom-0 h-1 rounded-b-lg transition-all duration-500 ease-out
                    ${activeTab === tab ? 'w-full' : 'w-0'}`}
                  style={{ 
                    backgroundColor: activeTab === tab ? colors.vampireBlack : 'transparent'
                  }}
                />
              </button>
            ))}
          </div>

          <div className="mt-6 transform transition-all duration-500">
            {activeTab === 'pipeline' ? <PipelineCalculator /> : <TimeSavingsCalculator />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Calculator({ children, title, description }) {
  return (
    <div
      style={{ 
        backgroundColor: 'rgba(8, 9, 10, 0.15)',
        borderColor: colors.vampireBlack 
      }}
      className="rounded-xl shadow-2xl p-8 border border-opacity-20"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-3" style={{ color: colors.vampireBlack }}>
          {title}
        </h2>
        <p style={{ color: colors.vampireBlack }} className="font-medium text-lg">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

function TimeSavingsCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(400);

  const weeklyROI = hoursPerWeek * hourlyRate;
  const monthlyROI = weeklyROI * 4;
  const annualROI = weeklyROI * 52;

  return (
    <Calculator
      title="Time Savings ROI Calculator"
      description="See how many hours per week you can reclaim with AI automation, and the direct financial impact."
    >
      <div className="space-y-8">
        <SliderInput
          label="Hours Saved Per Week"
          value={hoursPerWeek}
          onChange={setHoursPerWeek}
          max={40}
          step={1}
          unit=" hours"
          tooltip="These are the estimated hours freed each week by automating repetitive tasks."
        />

        <SliderInput
          label="Hourly Billing Rate"
          value={hourlyRate}
          onChange={setHourlyRate}
          min={200}
          max={1000}
          step={50}
          unit="$"
          tooltip="The average hourly fee you charge clients for your services."
        />

        <ResultsCard 
          monthlyValue={monthlyROI}
          annualValue={annualROI}
          subtitle="Projected yearly savings based on current rates"
        />
      </div>
    </Calculator>
  );
}

function PipelineCalculator() {
  const [monthlyCalls, setMonthlyCalls] = useState(10);
  const [callShow, setCallShow] = useState(95);
  const [qualification, setQualification] = useState(80);
  const [lifetimeValue, setLifetimeValue] = useState(50000);
  const [closingRate, setClosingRate] = useState(20);

  const pipelineValue = monthlyCalls 
    * (callShow / 100) 
    * (qualification / 100) 
    * lifetimeValue;

  const monthlyPipelineValue = pipelineValue;
  const annualPipelineValue = monthlyPipelineValue * 12;
  const monthlyROI = pipelineValue * (closingRate / 100);
  const annualROI = monthlyROI * 12;

  return (
    <Calculator
      title="Pipeline Value & ROI Calculator"
      description="Calculate potential revenue from new leads and see how final ROI depends on your closing rate."
    >
      <div className="space-y-12">
        <div className="space-y-8">
          <h3 className="text-2xl font-bold" style={{ color: colors.vampireBlack }}>
            Stage 1: Pipeline Value
          </h3>
          
          <div className="space-y-6">
            <SliderInput
              label="Monthly Discovery Calls"
              value={monthlyCalls}
              onChange={setMonthlyCalls}
              max={50}
              step={1}
              unit=" calls"
              tooltip="Number of prospective clients who agree to learn about your services."
            />

            <SliderInput
              label="Call Show Rate"
              value={callShow}
              onChange={setCallShow}
              min={75}
              max={100}
              step={1}
              unit="%"
              tooltip="The proportion of leads who show up for meetings."
            />

            <SliderInput
              label="Qualification Rate"
              value={qualification}
              onChange={setQualification}
              min={50}
              max={100}
              step={1}
              unit="%"
              tooltip="Of those who attend, how many match your target criteria."
            />

            <SliderInput
              label="Client Lifetime Value"
              value={lifetimeValue}
              onChange={setLifetimeValue}
              min={10000}
              max={300000}
              step={5000}
              unit="$"
              tooltip="The total revenue expected per client over their entire engagement period."
              format={val => val.toLocaleString()}
            />
          </div>

          <ResultsCard 
            monthlyValue={monthlyPipelineValue}
            annualValue={annualPipelineValue}
            subtitle="Projected yearly pipeline value based on current metrics"
            label="Pipeline Value"
          />
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-bold" style={{ color: colors.vampireBlack }}>
            Stage 2: ROI Calculation
          </h3>
          
          <SliderInput
            label="Closing Rate"
            value={closingRate}
            onChange={setClosingRate}
            max={70}
            step={1}
            unit="%"
            tooltip="The percentage of qualified prospects you successfully convert into paying clients."
          />

          <ResultsCard 
            monthlyValue={monthlyROI}
            annualValue={annualROI}
            subtitle="Projected yearly revenue based on closing rate"
            label="ROI"
          />
        </div>
      </div>
    </Calculator>
  );
}

function ResultsCard({ monthlyValue, annualValue, subtitle, label = '' }) {
  return (
    <div 
      className="rounded-lg p-6 transform transition-all duration-300 hover:scale-105" 
      style={{ backgroundColor: colors.cultured }}
    >
      <div className="grid grid-cols-1 gap-6">
        <div 
          className="border-b pb-4"
          style={{ borderColor: colors.gray[500] }}
        >
          <div style={{ color: colors.vampireBlack }} className="text-sm font-medium">
            Monthly {label}
          </div>
          <div className="text-3xl font-bold" style={{ color: colors.vampireBlack }}>
            ${monthlyValue.toLocaleString()}
          </div>
        </div>
        <div className="pt-2">
          <div 
            style={{ color: colors.vampireBlack }} 
            className="text-sm font-medium uppercase tracking-wider"
          >
            Annual {label}
          </div>
          <div className="text-4xl font-bold" style={{ color: colors.vampireBlack }}>
            ${annualValue.toLocaleString()}
          </div>
          <div className="mt-2 text-sm" style={{ color: colors.gray[400] }}>
            {subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}

function SliderInput({ 
  label, 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1, 
  unit = '', 
  tooltip = '', 
  format = val => val 
}) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-3">
        <label 
          className="flex items-center text-base font-medium" 
          style={{ color: colors.vampireBlack }}
        >
          {label}
          {tooltip && (
            <div className="relative ml-2">
              <Info 
                className="w-4 h-4 transition-colors duration-200 hover:text-vampireBlack" 
                style={{ color: colors.vampireBlack }} 
              />
              <div 
                className="invisible group-hover:visible absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 rounded-lg z-10 text-sm"
                style={{ backgroundColor: colors.cultured, color: colors.vampireBlack }}
              >
                {tooltip}
                <div 
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45" 
                  style={{ backgroundColor: colors.cultured }}
                />
              </div>
            </div>
          )}
        </label>
        <span className="font-bold text-lg" style={{ color: colors.vampireBlack }}>
          {unit === '$' ? `$${format(value)}` : `${format(value)}${unit}`}
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none transition-all duration-200"
        style={{
          backgroundColor: 'rgba(8, 9, 10, 0.1)',
          backgroundImage: `linear-gradient(to right, ${colors.vampireBlack} ${(value - min) / (max - min) * 100}%, rgba(8, 9, 10, 0.1) ${(value - min) / (max - min) * 100}%)`,
          WebkitAppearance: 'none',
          height: '4px',
          margin: '10px 0',
        }}
      />

      <style jsx>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${colors.vampireBlack};
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
          margin-top: -8px;
        }

        input[type='range']::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border: none;
          border-radius: 50%;
          background: ${colors.vampireBlack};
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
          margin-top: -8px;
        }

        input[type='range']::-webkit-slider-runnable-track {
          background: transparent;
          height: 4px;
          border-radius: 2px;
        }

        input[type='range']::-moz-range-track {
          background: transparent;
          height: 4px;
          border-radius: 2px;
        }

        input[type='range']::-webkit-slider-thumb:hover,
        input[type='range']::-moz-range-thumb:hover {
          transform: scale(1.2);
          background: ${colors.vampireBlack};
        }

        input[type='range']:active::-webkit-slider-thumb,
        input[type='range']:active::-moz-range-thumb {
          transform: scale(1.1);
        }

        input[type='range']:focus {
          outline: none;
        }

        input[type='range']::-ms-track {
          width: 100%;
          cursor: pointer;
          background: transparent; 
          border-color: transparent;
          color: transparent;
          height: 4px;
        }
      `}</style>
    </div>
  );
}