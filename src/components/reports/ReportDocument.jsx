import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { BrowserMultiFormatReader } from "@zxing/library";
import "./Button3D.css";
import "./ReportDocumentStyles.css";
import "./ReportUserOperatorChang.css";
import "./ReportUserRight.css";

function ReportDocument() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    programmeName: "",
    timeSlots: "",
    searchText: "",
  });

  // Data state
  const [programmeNames, setProgrammeNames] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [filteredReportData, setFilteredReportData] = useState([]);
  const [atnPersonsData, setAtnPersonsData] = useState({}); // Store Atnpersons data for each row
  const [chartData, setChartData] = useState({
    registeredMembers: 0,
    attendedMembers: 0,
  }); // Chart statistics
  const [debouncedSearchText, setDebouncedSearchText] = useState(""); // Debounced search for performance
  const [rowStylingRules, setRowStylingRules] = useState(null); // Row styling rules from API

  // QR Code scanning state
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [qrScanResult, setQrScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [qrError, setQrError] = useState(null);
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  // Load dropdown data on component mount
  useEffect(() => {
    fetchProgrammeNames();
    fetchTimeSlots();
    fetchRowStylingRules();
  }, []);

  // Debounce search text to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(formData.searchText);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [formData.searchText]);

  // Optimized filtering with useMemo for better performance
  const filteredData = useMemo(() => {
    if (!debouncedSearchText.trim()) {
      return reportData.map((row, index) => ({ ...row, originalIndex: index }));
    }

    const searchTerm = debouncedSearchText.toLowerCase();

    // Pre-compute searchable strings for each row to avoid repeated computation
    return reportData
      .map((row, index) => ({ ...row, originalIndex: index }))
      .filter((row) => {
        // Create a single searchable string for the row including all fields (excluding originalIndex)
        const searchableString = Object.entries(row)
          .filter(([key]) => key !== "originalIndex") // Exclude our added index field
          .map(([key, value]) => {
            if (value === null || value === undefined) return "";

            // Convert value to string and include field name for better search
            const fieldValue = String(value).toLowerCase();
            const fieldName = key.toLowerCase();

            // Return both field name and value for comprehensive search
            return `${fieldName}:${fieldValue} ${fieldValue}`;
          })
          .join(" ");

        return searchableString.includes(searchTerm);
      });
  }, [reportData, debouncedSearchText]);

  // Update filtered data when computed result changes
  useEffect(() => {
    setFilteredReportData(filteredData);
  }, [filteredData]);

  // Optimized chart data calculation with memoization
  const chartStatistics = useMemo(() => {
    if (!reportData || reportData.length === 0) {
      return { registeredMembers: 0, attendedMembers: 0 };
    }

    let registeredMembers = 0;
    let attendedMembers = 0;

    // Cache field key lookups to avoid repeated filtering
    const firstRow = reportData[0];
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
        key.toLowerCase().includes("atn_persons")
    );

    if (statusKey && regPersonsKey) {
      reportData.forEach((row) => {
        const status = row[statusKey];
        const regPersons = parseInt(row[regPersonsKey]) || 0;

        if (String(status).toUpperCase() === "R") {
          // Registered
          registeredMembers += regPersons;
        } else if (String(status).toUpperCase() === "A") {
          // Attended
          attendedMembers += regPersons;
        }
      });
    }

    return { registeredMembers, attendedMembers };
  }, [reportData]);

  // Update chart data when statistics change
  useEffect(() => {
    setChartData(chartStatistics);
  }, [chartStatistics]);

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
        // Don't set error as this is optional functionality
      }
    } catch (err) {
      console.warn("Error fetching row styling rules:", err);
      // Don't set error as this is optional functionality
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = useCallback(async () => {
    // Allow search even without dropdowns - just show message if needed
    try {
      setLoading(true);
      setError(null);
      setReportData([]);
      setFilteredReportData([]); // Clear immediately for better UX

      // If no dropdowns selected, show a message but don't prevent search
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
      });

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(
        "https://lmrk-backend-pmnr.vercel.app/api/reportdocument",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            programmeName: formData.programmeName,
            timeSlots: formData.timeSlots,
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
        setReportData(reportResults);

        // Auto-populate AtnPersons input fields with data from API response
        const initialAtnPersonsData = {};
        reportResults.forEach((row, index) => {
          // Look for RegPersons or AtnPersons field in the row (case-insensitive)
          const personKeys = Object.keys(row).filter(
            (key) =>
              key.toLowerCase().includes("regpersons") ||
              key.toLowerCase().includes("reg_persons") ||
              key.toLowerCase().includes("atnpersons") ||
              key.toLowerCase().includes("atn_persons")
          );

          if (personKeys.length > 0) {
            const personValue = row[personKeys[0]];
            // Only populate if the value exists and is not null/empty
            if (
              personValue !== null &&
              personValue !== undefined &&
              personValue !== ""
            ) {
              initialAtnPersonsData[index] = String(personValue);
            }
          }
        });

        setAtnPersonsData(initialAtnPersonsData);
      } else {
        setError(data.message || "Failed to fetch report data");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request timeout. The server is taking too long to respond.");
      } else {
        console.error("Error fetching report data:", err);
        setError("Failed to fetch report data. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  }, [formData.programmeName, formData.timeSlots]);

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

  const handleAtnPersonsChange = useCallback((rowIndex, value) => {
    setAtnPersonsData((prev) => ({
      ...prev,
      [rowIndex]: value,
    }));
  }, []);

  const handleAddButtonClick = async (rowIndex, rowData) => {
    const atnPersons = atnPersonsData[rowIndex] || "";

    // Check if the record is already attended
    const statusKeys = Object.keys(rowData).filter((key) =>
      key.toLowerCase().includes("status")
    );
    const status = statusKeys.length > 0 ? rowData[statusKeys[0]] : "";
    const isAttended = String(status).toUpperCase() === "A";

    if (isAttended) {
      setError(
        "This member is already marked as attended and cannot be updated."
      );
      return;
    }

    // Validate AtnPersons input
    if (!atnPersons.trim()) {
      setError("Please enter AtnPersons value before clicking Add");
      return;
    }

    // Find phone field in the row data (case-insensitive search)
    const phoneKeys = Object.keys(rowData).filter(
      (key) =>
        key.toLowerCase().includes("phone") ||
        key.toLowerCase().includes("mobile") ||
        key.toLowerCase().includes("contact")
    );

    // Find name field in the row data (case-insensitive search)
    const nameKeys = Object.keys(rowData).filter((key) =>
      key.toLowerCase().includes("name")
    );

    const phone = phoneKeys.length > 0 ? rowData[phoneKeys[0]] : "";
    const name = nameKeys.length > 0 ? rowData[nameKeys[0]] : "Unknown";

    if (!phone) {
      setError("Phone number not found in the selected row");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        "https://lmrk-backend-pmnr.vercel.app/api/updateAttendMember",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: phone.toString(),
            atnPersons: atnPersons.toString(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Show success message in alert box
        window.alert(
          `Successfully updated attendance for phone: ${phone}, AtnPersons: ${atnPersons}, name '${name}'`
        );

        // Clear the AtnPersons input for this row after successful update
        setAtnPersonsData((prev) => ({
          ...prev,
          [rowIndex]: "",
        }));

        // Do not refresh to preserve the graph and current data state
      } else {
        setError(data.message || "Failed to update attend member");
      }
    } catch (err) {
      console.error("Error updating attend member:", err);
      setError("Failed to update attend member. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check row status and return appropriate styling based on API rules
  const getRowStyling = (row) => {
    // If no styling rules loaded, use default styling
    if (!rowStylingRules) {
      return {};
    }

    const { rules, priority, default: defaultStyle } = rowStylingRules;

    // Look for status field in the row (case-insensitive)
    const statusKeys = Object.keys(row).filter((key) =>
      key.toLowerCase().includes("status")
    );

    // Look for RegPersons and AtnPersons fields
    const regPersonsKeys = Object.keys(row).filter(
      (key) =>
        key.toLowerCase().includes("regpersons") ||
        key.toLowerCase().includes("reg_persons")
    );
    const atnPersonsKeys = Object.keys(row).filter(
      (key) =>
        key.toLowerCase().includes("atnpersons") ||
        key.toLowerCase().includes("atn_persons")
    );

    if (statusKeys.length === 0) {
      return { backgroundColor: defaultStyle.color };
    }

    const status = row[statusKeys[0]];
    const statusUpper = String(status).toUpperCase();

    // Get numeric values for comparison
    const regPersons =
      regPersonsKeys.length > 0 ? parseInt(row[regPersonsKeys[0]]) || 0 : 0;
    const atnPersons =
      atnPersonsKeys.length > 0 ? parseInt(row[atnPersonsKeys[0]]) || 0 : 0;

    // Apply rules in priority order
    for (const ruleName of priority) {
      const rule = rules.find((r) => r.name === ruleName);
      if (!rule) continue;

      let shouldApplyRule = false;

      switch (rule.condition) {
        case "mismatch_attended":
          // AtnPersons ≠ RegPersons AND Status = A (Blue)
          shouldApplyRule = atnPersons !== regPersons && statusUpper === "A";
          break;
        case "attended":
          // Status = A (Red)
          shouldApplyRule = statusUpper === "A";
          break;
        case "registered":
          // Status = R (Green)
          shouldApplyRule = statusUpper === "R";
          break;
        default:
          shouldApplyRule = false;
      }

      if (shouldApplyRule) {
        return {
          backgroundColor: rule.color,
          borderLeft: `3px solid ${rule.borderColor}`,
          color: rule.textColor,
        };
      }
    }

    // Return default styling if no rules match
    return {
      backgroundColor: defaultStyle.color,
      color: defaultStyle.textColor,
    };
  };

  // Pie Chart Component
  const PieChart = ({ registeredMembers, attendedMembers }) => {
    const total = registeredMembers + attendedMembers;

    // If no data, show a message
    if (total === 0) {
      return (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="body2" color="textSecondary">
            No member data available. Please search for report data to see
            statistics.
          </Typography>
        </Box>
      );
    }

    const registeredPercentage = (registeredMembers / total) * 100;
    const attendedPercentage = (attendedMembers / total) * 100;

    // Calculate angles for pie slices
    const registeredAngle = (registeredPercentage / 100) * 360;

    const radius = 60;
    const centerX = 80;
    const centerY = 80;

    // Calculate path for registered members (green slice)
    const registeredEndAngle = registeredAngle;
    const registeredX =
      centerX + radius * Math.cos(((registeredEndAngle - 90) * Math.PI) / 180);
    const registeredY =
      centerY + radius * Math.sin(((registeredEndAngle - 90) * Math.PI) / 180);

    const registeredLargeArc = registeredAngle > 180 ? 1 : 0;
    const registeredPath = `M ${centerX} ${centerY} L ${centerX} ${
      centerY - radius
    } A ${radius} ${radius} 0 ${registeredLargeArc} 1 ${registeredX} ${registeredY} Z`;

    // Calculate path for attended members (red slice)
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
            style={{ border: "1px solid #ddd", borderRadius: "8px" }}
          >
            {/* Green slice for Registered Members */}
            {registeredMembers > 0 && (
              <path
                d={registeredPath}
                fill="#4caf50"
                stroke="#fff"
                strokeWidth="2"
              />
            )}
            {/* Red slice for Attended Members */}
            {attendedMembers > 0 && (
              <path
                d={attendedPath}
                fill="#f44336"
                stroke="#fff"
                strokeWidth="2"
              />
            )}
            {/* Center circle for better appearance */}
            <circle
              cx={centerX}
              cy={centerY}
              r="20"
              fill="#fff"
              stroke="#ddd"
              strokeWidth="1"
            />
          </svg>
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
              Registered Members:
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
              Attended Members:
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

  // QR Code scanning functions
  const handleQRScanSuccess = useCallback((qrText) => {
    setIsScanning(false);

    // Stop video stream
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    // Reset code reader
    if (codeReader.current) {
      codeReader.current.reset();
    }

    try {
      // Try to parse as JSON first
      let qrData;
      try {
        qrData = JSON.parse(qrText);
      } catch {
        // If not JSON, treat as plain text
        qrData = { rawText: qrText };
      }

      setQrScanResult({
        rawText: qrText,
        parsedData: qrData,
        timestamp: new Date().toLocaleString(),
      });

      console.log("QR scan result:", qrData);
    } catch (err) {
      console.error("Error processing QR data:", err);
      setQrError("Error processing QR code data.");
    }
  }, []);

  const startQRScanner = useCallback(async () => {
    try {
      setIsQRScannerOpen(true);
      setIsScanning(true);
      setQrError(null);
      setQrScanResult(null);

      // Initialize the code reader
      codeReader.current = new BrowserMultiFormatReader();

      // Request camera permissions and start scanning
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Use back camera on mobile
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        // Start decoding
        codeReader.current
          .decodeOnceFromVideoDevice(undefined, videoRef.current)
          .then((result) => {
            console.log("QR Code scanned:", result.text);
            handleQRScanSuccess(result.text);
          })
          .catch((err) => {
            console.error("QR scan error:", err);
            setQrError("Failed to scan QR code. Please try again.");
            setIsScanning(false);
          });
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setQrError("Camera access denied. Please allow camera permissions.");
      setIsScanning(false);
    }
  }, [handleQRScanSuccess]);

  const stopQRScanner = useCallback(() => {
    setIsScanning(false);

    // Stop video stream
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    // Reset code reader
    if (codeReader.current) {
      codeReader.current.reset();
      codeReader.current = null;
    }
  }, []);

  const closeQRScanner = useCallback(() => {
    stopQRScanner();
    setIsQRScannerOpen(false);
    setQrScanResult(null);
    setQrError(null);
  }, [stopQRScanner]);

  const handleMobileClick = useCallback(
    (mobileNumber) => {
      // Extract and clean mobile number
      const cleanMobile = String(mobileNumber).replace(/\D/g, ""); // Remove non-digits

      // Update search text with mobile number
      setFormData((prev) => ({
        ...prev,
        searchText: cleanMobile,
      }));

      // Close QR scanner
      closeQRScanner();

      // Show success message
      console.log("Mobile number added to search:", cleanMobile);
    },
    [closeQRScanner]
  );

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopQRScanner();
    };
  }, [stopQRScanner]);

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
                  padding: "0.6rem 4rem",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "2px solid #1976d2",
                  minWidth: "100px",
                }}
              >
                {loading ? "🔄 Fetching..." : "🔍Fetch "}
              </button>
              <button
                className="modal-close-btn"
                onClick={startQRScanner}
                disabled={loading || isScanning}
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
                  minWidth: "100px",
                }}
              >
                {isScanning ? "📷 Scanning..." : "📱 QR Scan"}
              </button>
              <button
                className="modal-close-btn"
                onClick={handleClose}
                disabled={loading}
                style={{
                  transform: "none",
                  transition: "none",
                  padding: "0.6rem 4rem",
                  borderRadius: "6px",
                  fontWeight: "bold",
                  fontSize: "0.85rem",
                  backgroundColor: "#757575",
                  color: "white",
                  border: "2px solid #757575",
                  minWidth: "100px",
                }}
              >
                ❌Close
              </button>
            </div>
          </div>

          {rowStylingRules && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "1rem",
                  fontSize: "0.875rem",
                }}
              >
                <strong>🎨 Row Colors:</strong>
                {rowStylingRules.rules.map((rule, index) => (
                  <span
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: rule.color,
                        border: `2px solid ${rule.borderColor}`,
                        borderRadius: "3px",
                      }}
                    ></div>
                    <span style={{ fontSize: "0.8rem" }}>
                      {rule.name === "mismatchAttended"
                        ? "🔵 Mismatch"
                        : rule.name === "attended"
                        ? "🔴 Attended"
                        : rule.name === "registered"
                        ? "🟢 Registered"
                        : rule.name}
                    </span>
                  </span>
                ))}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    marginLeft: "1rem",
                    paddingLeft: "1rem",
                    borderLeft: "1px solid #ddd",
                  }}
                >
                  <span style={{ fontSize: "0.8rem", color: "#666" }}>
                    💡 <strong>Note:</strong> "Add" button is disabled for
                    attended members (Status: A)
                  </span>
                </span>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Error/Success Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessages}>
          {error}
        </Alert>
      )}

      {/* Results Table */}
      {filteredReportData.length > 0 && (
        <Card className="results-card">
          <CardContent>
            {/* Compact Row Color Legend */}

            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 800,
                overflow: "auto",
                position: "relative",
                "& .MuiTable-root": {
                  "& .MuiTableHead-root": {
                    "& .MuiTableRow-root": {
                      "& .MuiTableCell-root": {
                        position: "sticky",
                        top: 0,
                        zIndex: 1000,
                        backgroundColor: "#f5f5f5 !important",
                        borderBottom: "2px solid #ddd !important",
                        fontWeight: "bold !important",
                      },
                    },
                  },
                },
              }}
            >
              <Table stickyHeader sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ minWidth: "80px" }}>Action</TableCell>
                    <TableCell sx={{ minWidth: "120px" }}>AtnPersons</TableCell>
                    {filteredReportData.length > 0 &&
                      Object.keys(filteredReportData[0])
                        .filter((key) => key !== "originalIndex") // Don't show the originalIndex column
                        .map((key, index) => (
                          <TableCell key={index} sx={{ whiteSpace: "nowrap" }}>
                            {key}
                          </TableCell>
                        ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* Optimized rendering - only show first 100 rows for performance */}
                  {filteredReportData.slice(0, 100).map((row) => {
                    const originalIndex = row.originalIndex; // Get the original index
                    const rowStyle = getRowStyling(row);

                    // Check if the row status is 'A' (Attended) to disable the Add button
                    const statusKeys = Object.keys(row).filter((key) =>
                      key.toLowerCase().includes("status")
                    );
                    const status =
                      statusKeys.length > 0 ? row[statusKeys[0]] : "";
                    const isAttended = String(status).toUpperCase() === "A";

                    return (
                      <TableRow
                        key={`row-${originalIndex}`}
                        hover
                        sx={{
                          ...rowStyle,
                          height: "32px", // Half the default height
                          "& td": {
                            padding: "4px 8px", // Reduce cell padding
                            fontSize: "0.875rem", // Slightly smaller font
                            lineHeight: 1.2,
                          },
                        }}
                      >
                        <TableCell>
                          <button
                            className="report-user-operator-btn"
                            onClick={() =>
                              handleAddButtonClick(originalIndex, row)
                            }
                            disabled={isAttended}
                            style={{
                              padding: "0.2rem 0.5rem",
                              fontSize: "0.75rem",
                              minWidth: "50px",
                              height: "24px",
                              backgroundColor: isAttended ? "#f5f5f5" : "",
                              color: isAttended ? "#999" : "",
                              cursor: isAttended ? "not-allowed" : "pointer",
                              opacity: isAttended ? 0.6 : 1,
                            }}
                            title={
                              isAttended
                                ? "Already attended - cannot update"
                                : "Click to update attendance"
                            }
                          >
                            {isAttended ? "✓ Done" : "Add"}
                          </button>
                        </TableCell>
                        <TableCell>
                          <input
                            className="report-user-operator-input"
                            type="text"
                            value={atnPersonsData[originalIndex] || ""}
                            onChange={(e) =>
                              handleAtnPersonsChange(
                                originalIndex,
                                e.target.value
                              )
                            }
                            placeholder={
                              isAttended
                                ? "Already attended"
                                : "Enter Atnpersons"
                            }
                            disabled={isAttended}
                            style={{
                              width: "120px",
                              padding: "0.15rem 0.25rem",
                              fontSize: "0.8rem",
                              height: "20px",
                              backgroundColor: isAttended ? "#f5f5f5" : "white",
                              color: isAttended ? "#999" : "black",
                              cursor: isAttended ? "not-allowed" : "text",
                            }}
                            title={
                              isAttended
                                ? "Cannot modify - already attended"
                                : "Enter number of persons attending"
                            }
                          />
                        </TableCell>
                        {Object.entries(row)
                          .filter(([key]) => key !== "originalIndex") // Don't show the originalIndex value
                          .map(([, value], cellIndex) => (
                            <TableCell key={cellIndex}>
                              {value !== null ? String(value) : ""}
                            </TableCell>
                          ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Performance notice for large datasets */}
            {filteredReportData.length > 100 && (
              <Alert severity="info" sx={{ mt: 1 }}>
                ⚡ Performance optimization: Showing first 100 of{" "}
                {filteredReportData.length} records. Use search to narrow down
                results for better performance.
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Performance Loading Message */}
      {loading && (
        <Alert severity="info" sx={{ mb: 2 }}>
          🔄 Loading data... This may take a moment for large datasets.
        </Alert>
      )}

      {/* No Results Message */}
      {!loading &&
        reportData.length > 0 &&
        filteredReportData.length === 0 &&
        debouncedSearchText && (
          <Alert severity="info">
            No records found matching "{debouncedSearchText}". Try a different
            search term.
          </Alert>
        )}

      {!loading &&
        reportData.length === 0 &&
        formData.programmeName &&
        formData.timeSlots &&
        !error && (
          <Alert severity="info">
            No records found for the selected criteria.
          </Alert>
        )}

      {/* QR Scanner Dialog */}
      <Dialog
        open={isQRScannerOpen}
        onClose={closeQRScanner}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: "#f5f5f5",
            borderRadius: "12px",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          📱 QR Code Scanner
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {!qrScanResult ? (
            <Box sx={{ textAlign: "center" }}>
              {qrError ? (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {qrError}
                </Alert>
              ) : (
                <Box>
                  {!isScanning ? (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
                        📷 Camera Scanner
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                        Click "Start Scanning" to open your camera and scan a QR
                        code
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={startQRScanner}
                        sx={{
                          backgroundColor: "#4caf50",
                          "&:hover": { backgroundColor: "#45a049" },
                          padding: "12px 24px",
                          fontSize: "1rem",
                        }}
                      >
                        📹 Start Scanning
                      </Button>
                    </Box>
                  ) : (
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
                        📱 Point camera at QR code
                      </Typography>
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          maxWidth: "400px",
                          margin: "0 auto",
                          border: "3px solid #1976d2",
                          borderRadius: "12px",
                          overflow: "hidden",
                        }}
                      >
                        <video
                          ref={videoRef}
                          style={{
                            width: "100%",
                            height: "300px",
                            objectFit: "cover",
                          }}
                          autoPlay
                          muted
                          playsInline
                        />
                        {isScanning && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              backgroundColor: "rgba(0,0,0,0.7)",
                              color: "white",
                              padding: "8px 16px",
                              borderRadius: "20px",
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <CircularProgress
                              size={16}
                              sx={{ color: "white" }}
                            />
                            <Typography variant="body2">Scanning...</Typography>
                          </Box>
                        )}
                      </Box>
                      <Button
                        variant="outlined"
                        onClick={stopQRScanner}
                        sx={{ mt: 2 }}
                      >
                        ⏹️ Stop Scanning
                      </Button>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" sx={{ mb: 2, color: "#4caf50" }}>
                ✅ QR Code Scanned Successfully!
              </Typography>

              <Alert severity="success" sx={{ mb: 2 }}>
                <strong>Scan Time:</strong> {qrScanResult.timestamp}
              </Alert>

              <Card sx={{ mb: 2, backgroundColor: "#f8f9fa" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
                    📄 Scanned Details
                  </Typography>

                  {/* Raw Text */}
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: "bold", color: "#555" }}
                    >
                      Raw Text:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        backgroundColor: "white",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        fontFamily: "monospace",
                        wordBreak: "break-all",
                      }}
                    >
                      {qrScanResult.rawText}
                    </Typography>
                  </Box>

                  {/* Parsed Data */}
                  {qrScanResult.parsedData &&
                    typeof qrScanResult.parsedData === "object" && (
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold", color: "#555", mb: 1 }}
                        >
                          Parsed Information:
                        </Typography>
                        <Box
                          sx={{
                            backgroundColor: "white",
                            padding: "12px",
                            borderRadius: "4px",
                            border: "1px solid #ddd",
                          }}
                        >
                          {Object.entries(qrScanResult.parsedData).map(
                            ([key, value]) => {
                              const isMobileNumber =
                                /^(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(
                                  String(value)
                                ) || /^\d{10,15}$/.test(String(value));

                              return (
                                <Box
                                  key={key}
                                  sx={{
                                    mb: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: "bold",
                                      minWidth: "80px",
                                    }}
                                  >
                                    {key}:
                                  </Typography>
                                  {isMobileNumber ? (
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      onClick={() => handleMobileClick(value)}
                                      sx={{
                                        backgroundColor: "#e3f2fd",
                                        border: "1px solid #1976d2",
                                        color: "#1976d2",
                                        "&:hover": {
                                          backgroundColor: "#1976d2",
                                          color: "white",
                                        },
                                      }}
                                    >
                                      📱 {value} (Click to search)
                                    </Button>
                                  ) : (
                                    <Typography variant="body2">
                                      {String(value)}
                                    </Typography>
                                  )}
                                </Box>
                              );
                            }
                          )}
                        </Box>
                      </Box>
                    )}
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
          <Button
            onClick={closeQRScanner}
            variant="contained"
            sx={{ backgroundColor: "#757575" }}
          >
            ❌ Close
          </Button>
          {qrScanResult && (
            <Button
              onClick={() => {
                setQrScanResult(null);
                setQrError(null);
              }}
              variant="outlined"
            >
              🔄 Scan Again
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ReportDocument;
