"use client";

const CLINIC_LAT = 36.20680278395476;
const CLINIC_LNG = 43.98619032336865;
const CLINIC_COORDS = `${CLINIC_LAT},${CLINIC_LNG}`;

function getMapEmbedSrc(apiKey?: string) {
  if (apiKey) {
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${CLINIC_COORDS}&zoom=14`;
  }

  return `https://www.google.com/maps?q=${CLINIC_COORDS}&hl=en&z=14&output=embed`;
}

type ClinicMapProps = {
  className?: string;
};

export function ClinicMap({ className = "" }: ClinicMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const embedSrc = getMapEmbedSrc(apiKey);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <iframe
        title="Restor Dental Clinic location"
        className="absolute inset-0 size-full border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={embedSrc}
      />
    </div>
  );
}
