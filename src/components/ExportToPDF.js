import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './ExportToPDF.css';

const ExportToPDF = () => {
  const generatePDF = () => {
    const content = document.getElementById('triggerTestContent'); // Get the dynamic content
    if (!content) {
      alert('Content not found for PDF export.');
      return;
    }

    // Initialize jsPDF
    const doc = new jsPDF();
    
    // Header Title
    const title = 'Test Report';
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, 10);
    
    // Subtitle with additional information (like report date and version)
    const subtitle = 'Bee Bot Generated Report';
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(subtitle, 14, 18);
    
    // Add current date and time
    const currentDateTime = new Date().toLocaleString();
    doc.setTextColor(0, 0, 0); // Black text for date
    doc.text(`Date: ${currentDateTime}`, 14, 26);

    // Add space between header and content
    doc.setLineWidth(0.5);
    doc.line(14, 28, 196, 28); // Horizontal line beneath header
    doc.setLineWidth(0); // Reset line width for other sections

    // Extract table data
    const table = content.querySelector('table');
    if (table) {
      const columns = Array.from(table.querySelectorAll('thead th'))
        .map((th) => th.textContent)
        .filter((col) => col.toLowerCase() !== 'delete'); // Exclude "Delete" column

      const rows = Array.from(table.querySelectorAll('tbody tr')).map((tr) =>
        Array.from(tr.querySelectorAll('td'))
          .map((td, index) => {
            const ths = Array.from(table.querySelectorAll('thead th'));
            const columnName = ths[index]?.textContent.toLowerCase();

            if (columnName === 'trigger test') {
              const cellText = td.textContent.trim().toLowerCase();
              if (cellText.includes('passed')) {
                return { text: 'Passed' }; // "Passed" text
              } else if (cellText.includes('failed')) {
                return { text: 'Failed' }; // "Failed" text
              } else {
                return { text: 'Run Test' }; // Default text when no status is found
              }
            }

            return { text: columnName !== 'delete' ? td.textContent : null };
          })
          .filter((cell) => cell.text !== null) // Remove null text cells
      );

      // Ensure there are no empty rows in the array
      const filteredRows = rows.filter(row => row.length > 0);

      // Customize table styling
      const tableStyles = {
        headStyles: {
          fillColor: [255, 186, 0], // Bee yellow for header
          textColor: [0, 0, 0], // Black text for header
          fontStyle: 'bold',
        },
        bodyStyles: {
          fillColor: [255, 255, 255], // White for body
          textColor: [0, 0, 0], // Black text for body
        },
        alternateRowStyles: {
          fillColor: [255, 245, 230], // Light yellow for alternate rows
        },
        startY: 40, // Adjust starting Y position to avoid overlap with header
      };

      // Ensure that the content doesn't overflow by manually adding a page break if necessary
      doc.autoTable({
        head: [columns],
        body: filteredRows.map(row => row.map(cell => cell.text)),
        ...tableStyles,
        didDrawPage: (data) => {
          const pageHeight = doc.internal.pageSize.height;
          if (data.cursor.y > pageHeight - 40) {
            doc.addPage(); // Add a new page if content overflows
          }
        },
      });
      
    }

    // Extract log messages
    const logMessages = Array.from(
      content.querySelectorAll('.log-messages-section .message-text')
    ).map((el) => el.textContent);
    
    if (logMessages.length > 0) {
      let y = doc.autoTable.previous.finalY + 10 || 40;
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14); // Slightly larger for section titles
      doc.text('Log Messages:', 14, y);
      y += 10;
    
      // Smaller font size for log messages
      doc.setFontSize(10);
      logMessages.forEach((message, index) => {
        const messageLines = doc.splitTextToSize(`${index + 1}. ${message}`, 180); // Limit text width to 180 units

        if (y + messageLines.length * 6 > doc.internal.pageSize.height - 20) { 
          doc.addPage();
          y = 20; // Reset Y position on new page
        }

        doc.text(messageLines, 10, y);
        y += messageLines.length * 6 + 2; // Adjust line spacing
      });
    }

    // Save the PDF
    doc.save('Report.pdf');
  };

  return (
    <div>
      <button onClick={generatePDF} className="export-pdf-button">
        Export to PDF
      </button>
    </div>
  );
};

export default ExportToPDF;
