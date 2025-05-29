
export const parseCSV = (csvText: string): Array<Record<string, string>> => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));
  const data: Array<Record<string, string>> = [];

  for (let i = 1; i < lines.length; i++) {
    const row = lines[i].split(',').map(cell => cell.trim().replace(/"/g, ''));
    const rowData: Record<string, string> = {};
    
    headers.forEach((header, index) => {
      rowData[header] = row[index] || '';
    });
    
    data.push(rowData);
  }

  return data;
};

export const generateCSV = (data: Array<Record<string, any>>): string => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] || '';
      // Escape commas and quotes in CSV values
      return typeof value === 'string' && (value.includes(',') || value.includes('"'))
        ? `"${value.replace(/"/g, '""')}"`
        : value;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

export const downloadCSV = (csvContent: string, filename: string): void => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
