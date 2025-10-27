import React, { useRef } from 'react';

const reportData = {
  title: 'Regional Public Health Risk Report',
  subtitle: 'Cholera and Typhoid Outbreak Projections',
  date_generated: '2025-10-26T23:11:54.294715+00:00',
  reporting_period: 'November 2025',
  regional_data: [
    {
      location: { region: 'Ashanti', district: 'Kumasi' },
      predictions: {
        cholera: { projected_cases: 0, projected_change_percent: -100.0, risk_level: 'Low' },
        typhoid: { projected_cases: 0, projected_change_percent: -100.0, risk_level: 'Low' }
      },
      key_factors_summary:
        'Kumasi experiences high rainfall and moderate population density, contributing to potential health risks due to a low sanitation index, average water quality, and poor waste management practices.'
    },
    {
      location: { region: 'Greater Accra', district: 'Accra' },
      predictions: {
        cholera: { projected_cases: 0, projected_change_percent: -100.0, risk_level: 'Low' },
        typhoid: { projected_cases: 0, projected_change_percent: -100.0, risk_level: 'Low' }
      },
      key_factors_summary:
        'Accra, a densely populated urban center, shows relatively better sanitation and water quality indices, though moderate rainfall and waste management still pose a concern for disease transmission.'
    },
    {
      location: { region: 'Northern', district: 'Tamale' },
      predictions: {
        cholera: { projected_cases: 0, projected_change_percent: -100.0, risk_level: 'Low' },
        typhoid: { projected_cases: 0, projected_change_percent: -100.0, risk_level: 'Low' }
      },
      key_factors_summary:
        'Tamale faces challenges with low sanitation and water quality indices, coupled with very poor waste management, increasing vulnerability despite lower rainfall and population density compared to other regions.'
    }
  ],
  description:
    'The November 2025 reporting period indicates a highly successful projected containment of cholera and typhoid across all monitored districts, with zero new cases anticipated. This widespread projected eradication signifies effective public health interventions or favorable seasonal conditions. However, underlying environmental and infrastructural challenges persist, particularly concerning sanitation, water quality, and waste management, which could pose future risks if not addressed proactively.',
  call_to_action:
    '1. Sustain and Enhance Preventive Measures: Invest in community health education and reinforce current hygiene promotion campaigns that have likely contributed to the projected zero cases.\n2. Infrastructure Development in Vulnerable Areas: Prioritize improvements in water and sanitation infrastructure, especially in districts like Tamale (Northern Region) with very low indices for sanitation, water quality, and waste management.\n3. Strengthen Surveillance and Early Warning Systems: Maintain rigorous surveillance to promptly detect any resurgence and to understand the specific factors that contributed to the projected success, ensuring long-term disease prevention.'
};

 function Report() {
  const ref = useRef<HTMLDivElement | null>(null);

  const downloadPDF = () => {
    if (!ref.current) return;
    const element = ref.current;
    const opt = {
      margin: 10,
      filename: `public-health-report-${reportData.reporting_period.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    } as any;

    (async () => {
      try {
        // Dynamically import so bundlers resolve correctly at runtime and we can detect failures
        const mod = await import('html2pdf.js');
        // html2pdf may be exported as default or as the module itself
        // @ts-ignore
        const factory = mod.default ?? mod;
        if (!factory) throw new Error('html2pdf module not available');

        // Some bundlers export a function, some export an object with a default function
        // Call the factory to obtain the chainable API
        // @ts-ignore
        factory().set(opt).from(element).save();
      } catch (err: any) {
        console.error('Failed to generate PDF', err);
        // Surface a helpful message to the user to aid debugging
        const msg = err?.message || String(err);
        alert(`Failed to generate PDF: ${msg}`);
      }
    })();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{reportData.title}</h1>
          <p className="text-sm text-gray-600">{reportData.subtitle}</p>
          <p className="text-xs text-gray-500 mt-1">Generated: {new Date(reportData.date_generated).toLocaleString()}</p>
        </div>

        <div className="flex flex-col gap-2">
          <button onClick={downloadPDF} className="px-4 py-2 bg-vita text-black font-semibold rounded">Download PDF</button>
        </div>
      </div>

      <div ref={ref} className="bg-white p-6 shadow rounded print:bg-white">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Reporting period: {reportData.reporting_period}</h2>
        </div>

        <div className="mb-4 text-gray-800">{reportData.description}</div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Regional summaries</h3>
          <div className="space-y-4">
            {reportData.regional_data.map((r, idx) => (
              <div key={idx} className="p-4 border rounded">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h4 className="font-bold">{r.location.district}, {r.location.region}</h4>
                    <div className="text-sm text-gray-600">{r.key_factors_summary}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">Cholera: <span className="font-semibold">{r.predictions.cholera.risk_level}</span></div>
                    <div className="text-sm">Typhoid: <span className="font-semibold">{r.predictions.typhoid.risk_level}</span></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div>
                    <div className="text-xs text-gray-500">Cholera projected cases</div>
                    <div className="text-xl font-bold">{r.predictions.cholera.projected_cases}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Typhoid projected cases</div>
                    <div className="text-xl font-bold">{r.predictions.typhoid.projected_cases}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Change (cholera)</div>
                    <div className="text-xl font-bold">{r.predictions.cholera.projected_change_percent}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Call to action</h3>
          <pre className="whitespace-pre-wrap text-gray-800">{reportData.call_to_action}</pre>
        </div>
      </div>
    </div>
  );
}

export default Report;
