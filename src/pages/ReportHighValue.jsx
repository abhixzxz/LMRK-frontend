// views/ReportHighValue.jsx
import React, { useEffect, useMemo, useState } from "react";
import "./ReportHighValue.css";

const SECTION_OPTIONS = ["DEPOSIT", "LOAN", "ALL"];
const SCHEME_OPTIONS = ["ALL", "FD", "RD", "SB", "CA", "OD", "HL"];

const initialState = {
    branchName: "ALL",
    section: "DEPOSIT",
    scheme: "ALL",
    minAmount: "500000",
    maxAmount: "600000",
    fromDate: "2019-01-01",
    toDate: "2019-01-02",
};

export default function ReportHighValue() {
    const [branches, setBranches] = useState(["ALL"]);
    const [form, setForm] = useState(initialState);
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [loadingReport, setLoadingReport] = useState(false);
    const [error, setError] = useState("");
    const [rows, setRows] = useState([]);
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        let ignore = false;
        async function loadBranches() {
            try {
                setLoadingBranches(true);
                setError("");

                const res = await fetch("/api/branches");
                if (!res.ok) throw new Error(`Failed to load branches (${res.status})`);

                const data = await res.json();

                if (ignore) return;

                // Ensure the branches are extracted correctly
                const names = ["ALL", ...(data.branches || [])];

                setBranches(names);
            } catch (e) {
                console.error(e);
                if (!ignore) {
                    setError("Could not load branch list.");
                    // Optionally set to an empty list or a default value
                    setBranches(["ALL"]);
                }
            } finally {
                if (!ignore) setLoadingBranches(false);
            }
        }
        loadBranches();
        return () => { ignore = true; };
    }, []);


    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const reset = () => {
        setForm(initialState);
        setRows([]);
        setError("");
        setTouched(false);
    };

    const validate = useMemo(() => {
        const errs = {};
        const min = Number(form.minAmount);
        const max = Number(form.maxAmount);
        const fd = form.fromDate ? new Date(form.fromDate) : null;
        const td = form.toDate ? new Date(form.toDate) : null;

        if (Number.isNaN(min) || min < 0) errs.minAmount = "Enter a valid minimum amount.";
        if (Number.isNaN(max) || max < 0) errs.maxAmount = "Enter a valid maximum amount.";
        if (!Number.isNaN(min) && !Number.isNaN(max) && min > max) errs.maxAmount = "Max amount must be >= Min amount.";
        if (!fd) errs.fromDate = "From date required.";
        if (!td) errs.toDate = "To date required.";
        if (fd && td && fd > td) errs.toDate = "To date must be >= From date.";
        return errs;
    }, [form]);

    const hasErrors = Object.keys(validate).length > 0;

    const runReport = async () => {
        setTouched(true);
        if (hasErrors) return;

        try {
            setLoadingReport(true);
            setError("");
            setRows([]);

            // Prepare payload expected by backend
            const payload = {
                branchName: form.branchName || "ALL",
                section: form.section || "DEPOSIT",
                scheme: form.scheme || "ALL",
                minAmount: form.minAmount?.toString() ?? "0",
                maxAmount: form.maxAmount?.toString() ?? "0",
                fromDate: form.fromDate, // yyyy-mm-dd from <input type="date">
                toDate: form.toDate,
            };

            const res = await fetch("/api/reports/high-value", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || `Request failed (${res.status})`);
            }
            const data = await res.json();
            setRows(data?.rows || []);
        } catch (e) {
            console.error(e);
            setError("Failed to load report. Please try again.");
        } finally {
            setLoadingReport(false);
        }
    };

    const columns = useMemo(() => (rows?.length ? Object.keys(rows[0]) : []), [rows]);

    return (
        <div className="hv-container">
            <div className="hv-card">
                <h2 className="hv-title">High Value Transaction Report</h2>

                                <div className="hv-form-grid">
                                    <div className="hv-branch-line">
                                        <div className="hv-field">
                                            <label>Branch Name</label>
                                            <select
                                                name="branchName"
                                                value={form.branchName}
                                                onChange={onChange}
                                                disabled={loadingBranches}
                                            >
                                                {branches.map((b) => (
                                                    <option key={b} value={b}>{b}</option>
                                                ))}
                                            </select>
                                            {loadingBranches && <small className="muted">Loading branches…</small>}
                                        </div>
                                    </div>

                                    <div className="hv-scheme-section-line">
                                        <div className="hv-field">
                                            <label>Section</label>
                                            <select name="section" value={form.section} onChange={onChange}>
                                                {SECTION_OPTIONS.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="hv-field">
                                            <label>Scheme</label>
                                            <select name="scheme" value={form.scheme} onChange={onChange}>
                                                {SCHEME_OPTIONS.map((s) => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="hv-amount-line">
                                        <div className="hv-field">
                                            <label>Min Amount</label>
                                            <input
                                                name="minAmount"
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={form.minAmount}
                                                onChange={onChange}
                                                className={touched && validate.minAmount ? "error" : ""}
                                                placeholder="e.g. 500000"
                                            />
                                            {touched && validate.minAmount && <small className="error-text">{validate.minAmount}</small>}
                                        </div>
                                        <div className="hv-field">
                                            <label>Max Amount</label>
                                            <input
                                                name="maxAmount"
                                                type="number"
                                                min="0"
                                                step="1"
                                                value={form.maxAmount}
                                                onChange={onChange}
                                                className={touched && validate.maxAmount ? "error" : ""}
                                                placeholder="e.g. 600000"
                                            />
                                            {touched && validate.maxAmount && <small className="error-text">{validate.maxAmount}</small>}
                                        </div>
                                    </div>

                                    <div className="hv-date-line">
                                        <div className="hv-field">
                                            <label>From Date</label>
                                            <input
                                                name="fromDate"
                                                type="date"
                                                value={form.fromDate}
                                                onChange={onChange}
                                                className={touched && validate.fromDate ? "error" : ""}
                                            />
                                            {touched && validate.fromDate && <small className="error-text">{validate.fromDate}</small>}
                                        </div>
                                        <div className="hv-field">
                                            <label>To Date</label>
                                            <input
                                                name="toDate"
                                                type="date"
                                                value={form.toDate}
                                                onChange={onChange}
                                                className={touched && validate.toDate ? "error" : ""}
                                            />
                                            {touched && validate.toDate && <small className="error-text">{validate.toDate}</small>}
                                        </div>
                                    </div>
                                </div>

                {error && <div className="hv-alert">{error}</div>}

                <div className="hv-actions">
                    <button
                        className="btn btn-red"
                        onClick={runReport}
                        disabled={loadingReport || loadingBranches || hasErrors && touched}
                        title="Run the report"
                    >
                        {loadingReport ? "Loading…" : "Show"}
                    </button>
                    <button className="btn btn-red-outline" onClick={reset} title="Clear and close">
                        Close
                    </button>
                </div>
            </div>

            <div className="hv-results">
                {rows?.length ? (
                    <div className="table-wrap">
                        <table className="hv-table">
                            <thead>
                                <tr>
                                    {columns.map((c) => (
                                        <th key={c}>{c}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((r, i) => (
                                    <tr key={i}>
                                        {columns.map((c) => (
                                            <td key={c + i}>{String(r[c] ?? "")}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="muted">No data yet. Choose filters and press Show.</div>
                )}
            </div>
        </div>
    );
}
