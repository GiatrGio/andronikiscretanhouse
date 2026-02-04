// Map of timezone IDs to country names
// This provides a privacy-friendly way to detect approximate country without IP lookup

const timezoneToCountry: Record<string, string> = {
  // Europe
  'Europe/London': 'United Kingdom',
  'Europe/Dublin': 'Ireland',
  'Europe/Paris': 'France',
  'Europe/Berlin': 'Germany',
  'Europe/Rome': 'Italy',
  'Europe/Madrid': 'Spain',
  'Europe/Lisbon': 'Portugal',
  'Europe/Amsterdam': 'Netherlands',
  'Europe/Brussels': 'Belgium',
  'Europe/Zurich': 'Switzerland',
  'Europe/Vienna': 'Austria',
  'Europe/Stockholm': 'Sweden',
  'Europe/Oslo': 'Norway',
  'Europe/Copenhagen': 'Denmark',
  'Europe/Helsinki': 'Finland',
  'Europe/Warsaw': 'Poland',
  'Europe/Prague': 'Czech Republic',
  'Europe/Budapest': 'Hungary',
  'Europe/Bucharest': 'Romania',
  'Europe/Sofia': 'Bulgaria',
  'Europe/Athens': 'Greece',
  'Europe/Istanbul': 'Turkey',
  'Europe/Moscow': 'Russia',
  'Europe/Kiev': 'Ukraine',
  'Europe/Kyiv': 'Ukraine',
  'Europe/Belgrade': 'Serbia',
  'Europe/Zagreb': 'Croatia',
  'Europe/Ljubljana': 'Slovenia',
  'Europe/Bratislava': 'Slovakia',
  'Europe/Luxembourg': 'Luxembourg',
  'Europe/Monaco': 'Monaco',
  'Europe/Malta': 'Malta',
  'Europe/Tallinn': 'Estonia',
  'Europe/Riga': 'Latvia',
  'Europe/Vilnius': 'Lithuania',
  'Europe/Minsk': 'Belarus',

  // North America
  'America/New_York': 'United States',
  'America/Chicago': 'United States',
  'America/Denver': 'United States',
  'America/Los_Angeles': 'United States',
  'America/Phoenix': 'United States',
  'America/Anchorage': 'United States',
  'America/Honolulu': 'United States',
  'America/Detroit': 'United States',
  'America/Indiana/Indianapolis': 'United States',
  'America/Toronto': 'Canada',
  'America/Vancouver': 'Canada',
  'America/Montreal': 'Canada',
  'America/Edmonton': 'Canada',
  'America/Winnipeg': 'Canada',
  'America/Halifax': 'Canada',
  'America/Mexico_City': 'Mexico',
  'America/Tijuana': 'Mexico',
  'America/Cancun': 'Mexico',

  // South America
  'America/Sao_Paulo': 'Brazil',
  'America/Buenos_Aires': 'Argentina',
  'America/Santiago': 'Chile',
  'America/Bogota': 'Colombia',
  'America/Lima': 'Peru',
  'America/Caracas': 'Venezuela',
  'America/Montevideo': 'Uruguay',
  'America/Asuncion': 'Paraguay',
  'America/La_Paz': 'Bolivia',
  'America/Guayaquil': 'Ecuador',

  // Asia
  'Asia/Tokyo': 'Japan',
  'Asia/Seoul': 'South Korea',
  'Asia/Shanghai': 'China',
  'Asia/Hong_Kong': 'Hong Kong',
  'Asia/Taipei': 'Taiwan',
  'Asia/Singapore': 'Singapore',
  'Asia/Bangkok': 'Thailand',
  'Asia/Ho_Chi_Minh': 'Vietnam',
  'Asia/Jakarta': 'Indonesia',
  'Asia/Manila': 'Philippines',
  'Asia/Kuala_Lumpur': 'Malaysia',
  'Asia/Kolkata': 'India',
  'Asia/Mumbai': 'India',
  'Asia/Dubai': 'United Arab Emirates',
  'Asia/Riyadh': 'Saudi Arabia',
  'Asia/Jerusalem': 'Israel',
  'Asia/Tel_Aviv': 'Israel',
  'Asia/Beirut': 'Lebanon',
  'Asia/Amman': 'Jordan',
  'Asia/Kuwait': 'Kuwait',
  'Asia/Qatar': 'Qatar',
  'Asia/Karachi': 'Pakistan',
  'Asia/Dhaka': 'Bangladesh',
  'Asia/Colombo': 'Sri Lanka',
  'Asia/Kathmandu': 'Nepal',

  // Oceania
  'Australia/Sydney': 'Australia',
  'Australia/Melbourne': 'Australia',
  'Australia/Brisbane': 'Australia',
  'Australia/Perth': 'Australia',
  'Australia/Adelaide': 'Australia',
  'Pacific/Auckland': 'New Zealand',
  'Pacific/Fiji': 'Fiji',

  // Africa
  'Africa/Cairo': 'Egypt',
  'Africa/Johannesburg': 'South Africa',
  'Africa/Lagos': 'Nigeria',
  'Africa/Nairobi': 'Kenya',
  'Africa/Casablanca': 'Morocco',
  'Africa/Algiers': 'Algeria',
  'Africa/Tunis': 'Tunisia',
  'Africa/Accra': 'Ghana',
  'Africa/Addis_Ababa': 'Ethiopia',

  // Middle East
  'Asia/Tehran': 'Iran',
  'Asia/Baghdad': 'Iraq',
};

export function getCountryFromTimezone(): string | null {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezoneToCountry[timezone] || null;
  } catch {
    return null;
  }
}

export { timezoneToCountry };
