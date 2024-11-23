import React from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './ExportToPDF.css';  // Import the CSS file for styles

const ExportToPDF = ({ contentId, filename = 'TestSuit.pdf', buttonText = 'Export to PDF' }) => {

  const exportToPDF = async () => {
    const content = document.getElementById(contentId); // Use dynamic content ID prop
    if (!content) {
      alert('Content not found for PDF export.');
      return;
    }

    try {
      // Preload images before rendering
      const preloadImages = () => {
        const promises = [];
        content.querySelectorAll('img').forEach((img) => {
          if (!img.complete) {
            promises.push(new Promise((resolve) => (img.onload = img.onerror = resolve)));
          }
        });
        return Promise.all(promises);
      };

      // Wait for all images to load
      await preloadImages();

      // Temporarily set content height to capture everything
      const originalHeight = content.style.height;
      content.style.height = 'auto';

      // Ensure the full height of the content is captured
      const fullContentHeight = content.scrollHeight;
      const viewportHeight = window.innerHeight;  // Viewport height to scroll in steps

      // Create a jsPDF instance
      const pdf = new jsPDF('portrait', 'px', 'a4'); // A4 size (595.28px x 841.89px)
      const pdfWidth = pdf.internal.pageSize.getWidth(); // A4 width
      const pdfHeight = pdf.internal.pageSize.getHeight(); // A4 height

      let totalHeightCaptured = 0;

      // Scroll and capture content in segments
      while (totalHeightCaptured < fullContentHeight) {
        // Scroll the content down by the viewport height
        content.scrollTo(0, totalHeightCaptured);

        // Render the visible portion of the content to a canvas
        const canvas = await html2canvas(content, {
          scale: 2, // Higher scale for better resolution
          useCORS: true, // Handle cross-origin images
          windowWidth: document.body.scrollWidth, // Ensure content width is captured
          windowHeight: viewportHeight, // Only capture the visible portion
        });

        const imgData = canvas.toDataURL('image/png');

        // Calculate the aspect ratio and image dimensions
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const aspectRatio = canvasWidth / canvasHeight;

        const imgWidth = pdfWidth; // Full width of the PDF
        const imgHeight = imgWidth / aspectRatio; // Maintain aspect ratio

        // If it's not the first slice, add a new page
        if (totalHeightCaptured > 0) {
          pdf.addPage();
        }

        // Add the current slice of the content to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // Update the total height captured
        totalHeightCaptured += viewportHeight;
      }

      // Save the PDF
      pdf.save(filename);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    }
  };

  return (
    <button onClick={exportToPDF} className="export-pdf-button">
      {buttonText}
    </button>
  );
};

export default ExportToPDF;
