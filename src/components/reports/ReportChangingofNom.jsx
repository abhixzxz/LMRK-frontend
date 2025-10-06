import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Button3D.css";
import "./ReportDocumentStyles.css";
import "./ReportUserOperatorChang.css";
import "./ReportUserRight.css";

function ReportChangingofNom() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    programmeName: "",
    timeSlots: "",
    searchText: "",
    selectedOption: 1, // 1 for Admitted members, 0 for Register members
  });

  // Data state
  const [programmeNames, setProgrammeNames] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [filteredReportData, setFilteredReportData] = useState([]);
  const [chartData, setChartData] = useState({
    registeredMembers: 0,
    attendedMembers: 0,
  }); // Chart statistics
  const [rowStylingRules, setRowStylingRules] = useState(null); // Row styling rules from API

  // Load dropdown data on component mount
  useEffect(() => {
    fetchProgrammeNames();
    fetchTimeSlots();
    fetchRowStylingRules();
  }, []);

  const fetchProgrammeNames = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://lmrk-backend-pmnr.vercel.app/api/ProgrammeName"
      );
      const data = await response.json();

      if (response.ok) {
        setProgrammeNames(data.programmeNames || []);
      } else {
        setError(data.message || "Failed to fetch programme names");
      }
    } catch (err) {
      console.error("Error fetching programme names:", err);
      setError("Failed to fetch programme names");
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://lmrk-backend-pmnr.vercel.app/api/TimeSlots"
      );
      const data = await response.json();

      if (response.ok) {
        setTimeSlots(data.timeSlots || []);
      } else {
        setError(data.message || "Failed to fetch time slots");
      }
    } catch (err) {
      console.error("Error fetching time slots:", err);
      setError("Failed to fetch time slots");
    } finally {
      setLoading(false);
    }
  };

  const fetchRowStylingRules = async () => {
    try {
      const response = await fetch(
        "https://lmrk-backend-pmnr.vercel.app/api/rowStyling"
      );
      const data = await response.json();

      if (response.ok) {
        setRowStylingRules(data.data || null);
        console.log("✅ Row styling rules loaded:", data.data);
      } else {
        console.warn("Failed to fetch row styling rules:", data.message);
      }
    } catch (err) {
      console.warn("Error fetching row styling rules:", err);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Optimized chart data calculation with memoization
  const calculateChartStatistics = useCallback(
    (data) => {
      if (!data || data.length === 0) {
        return { registeredMembers: 0, attendedMembers: 0 };
      }

      let registeredMembers = 0;
      let attendedMembers = 0;

      // Cache field key lookups to avoid repeated filtering
      const firstRow = data[0];
      // Look for status field: Status, status, STATUS (contains 'R' or 'A')
      const statusKey = Object.keys(firstRow).find((key) =>
        key.toLowerCase().includes("status")
      );
      // Look for person count field: RegPersons, reg_persons, AtnPersons, atn_persons, etc. (contains numbers)
      const regPersonsKey = Object.keys(firstRow).find(
        (key) =>
          key.toLowerCase().includes("regpersons") ||
          key.toLowerCase().includes("reg_persons") ||
          key.toLowerCase().includes("atnpersons") ||
          key.toLowerCase().includes("atn_persons") ||
          key.toLowerCase().includes("persons") ||
          key.toLowerCase().includes("count") ||
          key.toLowerCase().includes("total")
      );

      console.log("📊 Chart calculation - Found keys:", {
        statusKey,
        regPersonsKey,
      });

      if (statusKey && regPersonsKey) {
        data.forEach((row) => {
          const status = row[statusKey];
          const regPersons = parseInt(row[regPersonsKey]) || 1; // Default to 1 if no count field

          if (String(status).toUpperCase() === "R") {
            // Registered
            registeredMembers += regPersons;
          } else if (String(status).toUpperCase() === "A") {
            // Attended
            attendedMembers += regPersons;
          }
        });
      } else {
        // If no specific status field, count rows based on selected option
        if (formData.selectedOption === 1) {
          // Admitted members - count as attended
          attendedMembers = data.length;
        } else {
          // Register members - count as registered
          registeredMembers = data.length;
        }
      }

      console.log("📊 Chart statistics calculated:", {
        registeredMembers,
        attendedMembers,
      });
      return { registeredMembers, attendedMembers };
    },
    [formData.selectedOption]
  );

  const handleSearch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setReportData([]);
      // Don't reset filteredReportData here - let the useEffect handle it
      // Reset chart data at start of search
      setChartData({ registeredMembers: 0, attendedMembers: 0 });

      if (!formData.programmeName || !formData.timeSlots) {
        setError(
          "Please select both Programme Name and Time Slots for best results"
        );
        setLoading(false);
        return;
      }

      console.log("🔍 Starting API call with:", {
        programmeName: formData.programmeName,
        timeSlots: formData.timeSlots,
        optionValue: formData.selectedOption,
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(
        "https://lmrk-backend-pmnr.vercel.app/api/regMembersReport",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            programmeName: formData.programmeName,
            timeSlots: formData.timeSlots,
            optionValue: formData.selectedOption,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      console.log(
        "📡 API Response status:",
        response.status,
        response.statusText
      );

      const data = await response.json();
      console.log("📦 API Response data:", data);

      if (response.ok) {
        const reportResults = data.data || [];
        console.log("✅ Report results count:", reportResults.length);

        if (reportResults.length === 0) {
          setError(
            `No data found for the selected criteria. Please check if there are ${
              formData.selectedOption === 1 ? "admitted" : "registered"
            } members for programme "${formData.programmeName}" in time slot "${
              formData.timeSlots
            }".`
          );
          // Reset chart data when no results
          setChartData({ registeredMembers: 0, attendedMembers: 0 });
        } else {
          // Calculate and update chart statistics
          const chartStats = calculateChartStatistics(reportResults);
          console.log("📊 Updating chart with stats:", chartStats);
          setChartData(chartStats);
        }

        setReportData(reportResults);
        // Don't set filteredReportData here - let the useEffect handle it
      } else {
        console.error("❌ API Error:", data);
        setError(data.message || "Failed to fetch report data");
        // Reset chart data on error
        setChartData({ registeredMembers: 0, attendedMembers: 0 });
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request timeout. The server is taking too long to respond.");
      } else {
        console.error("Error fetching report data:", err);
        setError("Failed to fetch report data. Please check your connection.");
      }
      // Reset chart data on error
      setChartData({ registeredMembers: 0, attendedMembers: 0 });
    } finally {
      setLoading(false);
    }
  }, [
    formData.programmeName,
    formData.timeSlots,
    formData.selectedOption,
    calculateChartStatistics,
  ]);

  const handleClose = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const clearMessages = useCallback(() => {
    setError(null);
  }, []);

  const clearSearch = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      searchText: "",
    }));
  }, []);

  const handleOptionChange = useCallback((optionValue) => {
    setFormData((prev) => ({
      ...prev,
      selectedOption: optionValue,
    }));
  }, []);

  const exportToPDF = useCallback(() => {
    if (filteredReportData.length === 0) {
      setError("No data available to export");
      return;
    }

    // Enhanced PDF export implementation with better formatting
    const printWindow = window.open("", "_blank");
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const reportTitle =
      formData.selectedOption === 1
        ? "Admitted Members Report"
        : "Register Members Report";

    // Get column headers
    const headers =
      filteredReportData.length > 0 ? Object.keys(filteredReportData[0]) : [];

    printWindow.document.write(`
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            @page {
              margin: 15mm;
              size: A4 landscape;
            }
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px;
              font-size: 12px;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 3px solid #1976d2;
              padding-bottom: 15px;
            }
            h1 { 
              color: #1976d2; 
              margin: 0 0 10px 0;
              font-size: 24px;
              font-weight: bold;
            }
            .report-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 25px;
              background-color: #f8f9fa;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #e0e0e0;
            }
            .info-section {
              display: flex;
              flex-direction: column;
              gap: 8px;
            }
            .info-item {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            .info-label {
              font-weight: bold;
              color: #555;
              min-width: 120px;
            }
            .info-value {
              color: #1976d2;
              font-weight: 600;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 20px;
              font-size: 11px;
              page-break-inside: auto;
            }
            thead {
              background-color: #1976d2;
              color: white;
            }
            th, td { 
              border: 1px solid #ddd; 
              padding: 8px 6px; 
              text-align: left;
              word-wrap: break-word;
              max-width: 150px;
            }
            th { 
              background-color: #1976d2;
              color: white;
              font-weight: bold;
              text-align: center;
              font-size: 12px;
            }
            tbody tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            tbody tr:hover {
              background-color: #e3f2fd;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 10px;
              color: #666;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
            .summary {
              background-color: #e3f2fd;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
              border-left: 5px solid #1976d2;
            }
            .no-data {
              text-align: center;
              color: #666;
              font-style: italic;
            }
            @media print {
              body { 
                font-size: 10px; 
              }
              table {
                font-size: 9px;
              }
              .no-print {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 ${reportTitle}</h1>
            <p style="margin: 5px 0; color: #666; font-size: 14px;">
              Generated on ${currentDate} at ${currentTime}
            </p>
          </div>

          <div class="report-info">
            <div class="info-section">
              <div class="info-item">
                <span class="info-label">📋 Programme:</span>
                <span class="info-value">${formData.programmeName}</span>
              </div>
              <div class="info-item">
                <span class="info-label">⏰ Time Slot:</span>
                <span class="info-value">${formData.timeSlots}</span>
              </div>
            </div>
            <div class="info-section">
              <div class="info-item">
                <span class="info-label">👥 Report Type:</span>
                <span class="info-value">${
                  formData.selectedOption === 1
                    ? "✅ Admitted Members"
                    : "📝 Register Members"
                }</span>
              </div>
              <div class="info-item">
                <span class="info-label">📊 Total Records:</span>
                <span class="info-value">${filteredReportData.length}</span>
              </div>
            </div>
          </div>

          <div class="summary">
            <strong>📋 Report Summary:</strong> This report contains ${
              filteredReportData.length
            } records of ${
      formData.selectedOption === 1 ? "admitted" : "registered"
    } members for the "${formData.programmeName}" programme during "${
      formData.timeSlots
    }" time slot.
          </div>

          ${
            filteredReportData.length > 0
              ? `
            <table>
              <thead>
                <tr>
                  ${headers.map((header) => `<th>${header}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${filteredReportData
                  .map(
                    (row) =>
                      `<tr>${Object.values(row)
                        .map(
                          (value) =>
                            `<td>${
                              value !== null && value !== undefined
                                ? String(value).replace(/'/g, "&#39;")
                                : '<span class="no-data">-</span>'
                            }</td>`
                        )
                        .join("")}</tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          `
              : `
            <div style="text-align: center; padding: 40px; color: #666;">
              <p style="font-size: 18px;">📄 No data available for the selected criteria</p>
            </div>
          `
          }

          <div class="footer">
            <p><strong>Report Generated by:</strong> LMRK System | <strong>Date:</strong> ${currentDate} ${currentTime}</p>
            <p><strong>Note:</strong> This is a computer-generated report. Please verify data accuracy before making decisions.</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for content to load before printing
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }, [
    filteredReportData,
    formData.programmeName,
    formData.timeSlots,
    formData.selectedOption,
  ]);

  // Pie Chart Component
  const PieChart = ({ registeredMembers, attendedMembers }) => {
    const total = registeredMembers + attendedMembers;

    if (total === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="body2" color="textSecondary">
            {loading
              ? "🔄 Loading chart data..."
              : "No member data available. Click 'Report' button to generate statistics."}
          </Typography>
        </Box>
      );
    }

    const registeredPercentage = (registeredMembers / total) * 100;
    const attendedPercentage = (attendedMembers / total) * 100;

    const registeredAngle = (registeredPercentage / 100) * 360;
    const radius = 60;
    const centerX = 80;
    const centerY = 80;

    const registeredEndAngle = registeredAngle;
    const registeredX =
      centerX + radius * Math.cos(((registeredEndAngle - 90) * Math.PI) / 180);
    const registeredY =
      centerY + radius * Math.sin(((registeredEndAngle - 90) * Math.PI) / 180);

    const registeredLargeArc = registeredAngle > 180 ? 1 : 0;
    const registeredPath = `M ${centerX} ${centerY} L ${centerX} ${
      centerY - radius
    } A ${radius} ${radius} 0 ${registeredLargeArc} 1 ${registeredX} ${registeredY} Z`;

    const attendedStartAngle = registeredAngle;
    const attendedStartX =
      centerX + radius * Math.cos(((attendedStartAngle - 90) * Math.PI) / 180);
    const attendedStartY =
      centerY + radius * Math.sin(((attendedStartAngle - 90) * Math.PI) / 180);

    const attendedLargeArc = attendedPercentage > 50 ? 1 : 0;
    const attendedPath = `M ${centerX} ${centerY} L ${attendedStartX} ${attendedStartY} A ${radius} ${radius} 0 ${attendedLargeArc} 1 ${centerX} ${
      centerY - radius
    } Z`;

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Box sx={{ position: "relative" }}>
          <svg
            width="160"
            height="160"
            viewBox="0 0 160 160"
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              transition: "all 0.3s ease-in-out",
              filter: loading ? "blur(1px)" : "none",
            }}
          >
            {registeredMembers > 0 && (
              <path
                d={registeredPath}
                fill="#4caf50"
                stroke="#fff"
                strokeWidth="2"
                style={{ transition: "all 0.5s ease-in-out" }}
              />
            )}
            {attendedMembers > 0 && (
              <path
                d={attendedPath}
                fill="#f44336"
                stroke="#fff"
                strokeWidth="2"
                style={{ transition: "all 0.5s ease-in-out" }}
              />
            )}
            <circle
              cx={centerX}
              cy={centerY}
              r="20"
              fill="#fff"
              stroke="#ddd"
              strokeWidth="1"
            />
          </svg>
          {loading && (
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
              }}
            >
              <CircularProgress size={24} />
            </Box>
          )}
        </Box>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: "#4caf50",
                borderRadius: "50%",
                mr: 1,
              }}
            />
            <Typography variant="body2" sx={{ mr: 1 }}>
              {formData.selectedOption === 1
                ? "Admitted Members:"
                : "Registered Members:"}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {registeredMembers.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: 16,
                height: 16,
                backgroundColor: "#f44336",
                borderRadius: "50%",
                mr: 1,
              }}
            />
            <Typography variant="body2" sx={{ mr: 1 }}>
              {formData.selectedOption === 1
                ? "Attended Members:"
                : "Other Members:"}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {attendedMembers.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Typography
              variant="caption"
              sx={{ color: "#666", fontWeight: "900" }}
            >
              Total: {total.toLocaleString()} | Green:{" "}
              {registeredPercentage.toFixed(1)}% | Red:{" "}
              {attendedPercentage.toFixed(1)}%
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  // Filter report data based on search text
  useEffect(() => {
    if (!formData.searchText.trim()) {
      setFilteredReportData(reportData);
      return;
    }

    const searchTerm = formData.searchText.toLowerCase();
    const filtered = reportData.filter((row) => {
      // Create a searchable string for the row including all fields
      const searchableString = Object.values(row)
        .map((value) => {
          if (value === null || value === undefined) return "";
          return String(value).toLowerCase();
        })
        .join(" ");

      return searchableString.includes(searchTerm);
    });

    setFilteredReportData(filtered);
  }, [reportData, formData.searchText]);

  // Update chart data when filtered data changes
  useEffect(() => {
    if (filteredReportData.length > 0) {
      const chartStats = calculateChartStatistics(filteredReportData);
      setChartData(chartStats);
    } else if (reportData.length > 0) {
      // If there are no filtered results but we have report data, reset to original stats
      const chartStats = calculateChartStatistics(reportData);
      setChartData(chartStats);
    }
  }, [filteredReportData, reportData, calculateChartStatistics]);

  return (
    <Box className="report-document-container">
      <Card className="report-form-card" sx={{ mb: 3 }}>
        <CardContent>
          {loading && (
            <div className="loading-overlay">
              <CircularProgress className="loading-spinner" size={40} />
            </div>
          )}

          {/* Single Row Layout: Statistics on Left, Form Controls on Right */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "1.5rem",
              padding: "1rem",
            }}
          >
            {/* Left Side: Member Statistics */}
            <div
              style={{
                minWidth: "280px",
                flex: "0 0 auto",
                backgroundColor: "#f8f9fa",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #e3f2fd",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 1,
                  color: "#1976d2",
                  fontWeight: "bold",
                  textAlign: "center",
                  borderBottom: "2px solid #e3f2fd",
                  paddingBottom: "0.3rem",
                  fontSize: "1rem",
                }}
              >
                📊 Member Statistics
              </Typography>
              <div
                style={{
                  transform: "scale(0.8)",
                  transformOrigin: "center top",
                }}
              >
                <PieChart
                  registeredMembers={chartData.registeredMembers}
                  attendedMembers={chartData.attendedMembers}
                />
              </div>
            </div>

            {/* Middle: Form Controls */}
            <div
              style={{
                width: "320px",
                height: "fit-content",
                flex: "0 0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                backgroundColor: "#fafafa",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 0.3,
                  color: "#1976d2",
                  fontWeight: "bold",
                  textAlign: "center",
                  borderBottom: "2px solid #e3f2fd",
                  paddingBottom: "0.2rem",
                  fontSize: "1rem",
                }}
              >
                🔍 Search & Filter Controls
              </Typography>

              {/* Form Controls Compact Layout */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                {/* Programme Name */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <label
                    className="dropdown-label"
                    style={{
                      fontWeight: "bold",
                      color: "#555",
                      fontSize: "0.75rem",
                    }}
                  >
                    📋 Programme Name:
                  </label>
                  <select
                    className="user-dropdown"
                    name="programmeName"
                    value={formData.programmeName}
                    onChange={handleInputChange}
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "0.35rem",
                      borderRadius: "4px",
                      border: "1px solid #e0e0e0",
                      fontSize: "0.75rem",
                    }}
                  >
                    <option value="">-- Select Programme Name --</option>
                    {programmeNames.map((name, index) => (
                      <option key={index} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Time Slots */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <label
                    className="dropdown-label"
                    style={{
                      fontWeight: "bold",
                      color: "#555",
                      fontSize: "0.75rem",
                    }}
                  >
                    ⏰ Time Slots:
                  </label>
                  <select
                    className="user-dropdown"
                    name="timeSlots"
                    value={formData.timeSlots}
                    onChange={handleInputChange}
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "0.35rem",
                      borderRadius: "4px",
                      border: "1px solid #e0e0e0",
                      fontSize: "0.75rem",
                    }}
                  >
                    <option value="">-- Select Time Slot --</option>
                    {timeSlots.map((slot, index) => (
                      <option key={index} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Text Field */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <label
                      className="dropdown-label"
                      style={{
                        fontWeight: "bold",
                        color: "#555",
                        fontSize: "0.75rem",
                      }}
                    >
                      🔍 Search in Data:
                    </label>
                    {reportData.length > 0 && (
                      <span
                        style={{
                          fontSize: "0.65rem",
                          color: "#666",
                          padding: "1px 4px",
                          borderRadius: "8px",
                          fontWeight: "bold",
                        }}
                      >
                        {filteredReportData.length} of {reportData.length}{" "}
                        records
                      </span>
                    )}
                  </div>
                  <div style={{ position: "relative" }}>
                    <input
                      className="user-dropdown"
                      type="text"
                      name="searchText"
                      value={formData.searchText}
                      onChange={handleInputChange}
                      placeholder="Type to search by name, phone, or any field..."
                      disabled={loading}
                      style={{
                        width: "100%",
                        paddingRight: formData.searchText ? "25px" : "8px",
                        padding: "0.35rem 8px",
                        borderRadius: "4px",
                        border: formData.searchText
                          ? "2px solid #1976d2"
                          : "1px solid #e0e0e0",
                        fontSize: "0.75rem",
                        backgroundColor: formData.searchText
                          ? "#f3f8ff"
                          : "white",
                      }}
                    />
                    {formData.searchText && (
                      <button
                        onClick={clearSearch}
                        disabled={loading}
                        style={{
                          position: "absolute",
                          right: "4px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#ff5722",
                          fontSize: "12px",
                          fontWeight: "bold",
                          padding: "1px",
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                {/* Option Buttons */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <label
                    className="dropdown-label"
                    style={{
                      fontWeight: "bold",
                      color: "#555",
                      fontSize: "0.75rem",
                    }}
                  >
                    👥 Report Type:
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => handleOptionChange(1)}
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: "0.4rem 0.8rem",
                        borderRadius: "4px",
                        border: "2px solid",
                        borderColor:
                          formData.selectedOption === 1 ? "#1976d2" : "#e0e0e0",
                        backgroundColor:
                          formData.selectedOption === 1 ? "#1976d2" : "white",
                        color: formData.selectedOption === 1 ? "white" : "#555",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      ✅ Admitted
                    </button>
                    <button
                      onClick={() => handleOptionChange(0)}
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: "0.4rem 0.8rem",
                        borderRadius: "4px",
                        border: "2px solid",
                        borderColor:
                          formData.selectedOption === 0 ? "#1976d2" : "#e0e0e0",
                        backgroundColor:
                          formData.selectedOption === 0 ? "#1976d2" : "white",
                        color: formData.selectedOption === 0 ? "white" : "#555",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      📝 Register
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Action Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
                alignItems: "flex-start",
              }}
            >
              <button
                className="modal-close-btn"
                onClick={handleSearch}
                disabled={loading}
                style={{
                  transform: "none",
                  transition: "none",
                  padding: "0.6rem 2rem",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "2px solid #1976d2",
                  minWidth: "120px",
                }}
              >
                {loading ? "🔄 Generating..." : "📊 Report"}
              </button>
              {filteredReportData.length > 0 && (
                <button
                  className="modal-close-btn"
                  onClick={exportToPDF}
                  disabled={loading}
                  style={{
                    transform: "none",
                    transition: "none",
                    padding: "0.6rem 2rem",
                    borderRadius: "6px",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
                    backgroundColor: "#ff9800",
                    color: "white",
                    border: "2px solid #ff9800",
                    minWidth: "120px",
                  }}
                >
                  📄 Export PDF
                </button>
              )}
              <button
                className="modal-close-btn"
                onClick={handleClose}
                disabled={loading}
                style={{
                  transform: "none",
                  transition: "none",
                  padding: "0.6rem 2rem",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "2px solid #1976d2",
                  minWidth: "120px",
                }}
              >
                ❌ Close
              </button>
            </div>
          </div>

          {rowStylingRules && <Alert severity="info" sx={{ mb: 2 }}></Alert>}
        </CardContent>
      </Card>

      {/* Error Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessages}>
          {error}
        </Alert>
      )}

      {/* Results Display */}
      {filteredReportData.length > 0 && (
        <Card className="results-card">
          <CardContent>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#1976d2", fontWeight: "bold" }}
              >
                📄{" "}
                {formData.selectedOption === 1
                  ? "Admitted Members"
                  : "Register Members"}{" "}
                Report ({filteredReportData.length} records)
              </Typography>
            </div>

            <div
              style={{
                overflowX: "auto",
                maxHeight: "600px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.85rem",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#f5f5f5",
                      position: "sticky",
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    {filteredReportData.length > 0 &&
                      Object.keys(filteredReportData[0]).map((key, index) => (
                        <th
                          key={index}
                          style={{
                            padding: "12px 8px",
                            textAlign: "left",
                            borderBottom: "2px solid #ddd",
                            fontWeight: "bold",
                            backgroundColor: "#f5f5f5",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {key}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredReportData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      style={{
                        borderBottom: "1px solid #eee",
                        "&:hover": { backgroundColor: "#f9f9f9" },
                      }}
                    >
                      {Object.values(row).map((value, cellIndex) => (
                        <td
                          key={cellIndex}
                          style={{
                            padding: "8px",
                            borderBottom: "1px solid #eee",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {value !== null && value !== undefined
                            ? String(value)
                            : ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                marginTop: "1rem",
                padding: "0.5rem",
                backgroundColor: "#f0f7ff",
                borderRadius: "4px",
                fontSize: "0.85rem",
                color: "#1976d2",
              }}
            >
              <strong>Report Details:</strong> Programme:{" "}
              {formData.programmeName} | Time Slot: {formData.timeSlots} | Type:{" "}
              {formData.selectedOption === 1
                ? "Admitted Members"
                : "Register Members"}
            </div>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default ReportChangingofNom;
