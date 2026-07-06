export interface Country {
  code: string;
  name: string;
  pincodeLabel: string;
  pincodePlaceholder: string;
  pincodeRegex: string;
  pincodeMaxLen: number;
  states: string[];
}

export const COUNTRIES: Country[] = [
  {
    code: 'IN', name: 'India',
    pincodeLabel: 'PIN Code', pincodePlaceholder: '6-digit PIN',
    pincodeRegex: '^\\d{6}$', pincodeMaxLen: 6,
    states: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
      'Andaman & Nicobar Islands', 'Chandigarh',
      'Dadra & Nagar Haveli and Daman & Diu', 'Delhi',
      'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
    ],
  },
  {
    code: 'US', name: 'United States',
    pincodeLabel: 'ZIP Code', pincodePlaceholder: '5-digit ZIP',
    pincodeRegex: '^\\d{5}(-\\d{4})?$', pincodeMaxLen: 10,
    states: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
      'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
      'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
      'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
      'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
      'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
      'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
      'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
      'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
      'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia',
    ],
  },
  {
    code: 'GB', name: 'United Kingdom',
    pincodeLabel: 'Postcode', pincodePlaceholder: 'e.g. SW1A 1AA',
    pincodeRegex: '^[A-Za-z]{1,2}\\d[A-Za-z\\d]? ?\\d[A-Za-z]{2}$', pincodeMaxLen: 8,
    states: ['England', 'Northern Ireland', 'Scotland', 'Wales'],
  },
  {
    code: 'CA', name: 'Canada',
    pincodeLabel: 'Postal Code', pincodePlaceholder: 'e.g. A1A 1A1',
    pincodeRegex: '^[A-Za-z]\\d[A-Za-z] ?\\d[A-Za-z]\\d$', pincodeMaxLen: 7,
    states: [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
      'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia',
      'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec',
      'Saskatchewan', 'Yukon',
    ],
  },
  {
    code: 'AU', name: 'Australia',
    pincodeLabel: 'Postcode', pincodePlaceholder: '4-digit postcode',
    pincodeRegex: '^\\d{4}$', pincodeMaxLen: 4,
    states: [
      'Australian Capital Territory', 'New South Wales', 'Northern Territory',
      'Queensland', 'South Australia', 'Tasmania', 'Victoria', 'Western Australia',
    ],
  },
  {
    code: 'AE', name: 'United Arab Emirates',
    pincodeLabel: 'Area Code', pincodePlaceholder: 'Optional',
    pincodeRegex: '^\\d{0,6}$', pincodeMaxLen: 6,
    states: ['Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras Al Khaimah', 'Sharjah', 'Umm Al Quwain'],
  },
  {
    code: 'SG', name: 'Singapore',
    pincodeLabel: 'Postal Code', pincodePlaceholder: '6-digit postal code',
    pincodeRegex: '^\\d{6}$', pincodeMaxLen: 6,
    states: [],
  },
  {
    code: 'NZ', name: 'New Zealand',
    pincodeLabel: 'Postcode', pincodePlaceholder: '4-digit postcode',
    pincodeRegex: '^\\d{4}$', pincodeMaxLen: 4,
    states: [
      'Auckland', "Bay of Plenty", 'Canterbury', 'Gisborne',
      "Hawke's Bay", 'Manawatū-Whanganui', 'Marlborough', 'Nelson',
      'Northland', 'Otago', 'Southland', 'Taranaki', 'Tasman',
      'Waikato', 'Wellington', 'West Coast',
    ],
  },
  {
    code: 'DE', name: 'Germany',
    pincodeLabel: 'Postleitzahl', pincodePlaceholder: '5-digit PLZ',
    pincodeRegex: '^\\d{5}$', pincodeMaxLen: 5,
    states: [
      'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen',
      'Hamburg', 'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern',
      'North Rhine-Westphalia', 'Rhineland-Palatinate', 'Saarland',
      'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia',
    ],
  },
  {
    code: 'FR', name: 'France',
    pincodeLabel: 'Code Postal', pincodePlaceholder: '5-digit code',
    pincodeRegex: '^\\d{5}$', pincodeMaxLen: 5,
    states: [
      'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne',
      'Centre-Val de Loire', 'Corse', 'Grand Est', 'Hauts-de-France',
      'Île-de-France', 'Normandie', 'Nouvelle-Aquitaine', 'Occitanie',
      'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur',
    ],
  },
  {
    code: 'OTHER', name: 'Other',
    pincodeLabel: 'Postal / ZIP Code', pincodePlaceholder: 'Postal code',
    pincodeRegex: '^.{1,12}$', pincodeMaxLen: 12,
    states: [],
  },
];

export function getCountry(code: string): Country | undefined {
  return COUNTRIES.find(c => c.code === code);
}

export function validatePincode(pincode: string, countryCode: string): boolean {
  const country = getCountry(countryCode);
  if (!country || !pincode.trim()) return false;
  return new RegExp(country.pincodeRegex).test(pincode.trim());
}
