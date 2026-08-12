import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { color, font, radius, space, typography } from "../theme/tokens";

/**
 * DESIGN.md Input Fields spec: ivory background, 1px Deep Brown bottom
 * border (thickens to 2px on focus, no glow/shadow), label-caps label
 * above the field. All three variants share this shell so react-hook-form's
 * `{...register("field")}` spreads straight onto the native element.
 */

const fieldShellStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: space(0.75),
};

const labelStyle = { ...typography.labelCaps, color: color.onSurfaceVariant };

const errorTextStyle = { fontSize: "12px", color: color.error, margin: 0 };
const hintTextStyle = { fontSize: "12px", color: color.onSurfaceVariant, margin: 0 };

function baseControlStyle(hasError: boolean) {
  return {
    fontFamily: font.sans,
    fontSize: "14px",
    color: color.onSurface,
    background: color.surfaceContainerLowest,
    border: "none",
    borderBottom: `1px solid ${hasError ? color.error : color.outlineVariant}`,
    borderRadius: `${radius.sm} ${radius.sm} 0 0`,
    padding: `${space(1.25)} ${space(1)}`,
    outline: "none",
    width: "100%",
  };
}

interface FieldWrapperProps {
  label: string;
  error?: string;
  hint?: string;
  htmlFor: string;
  children: React.ReactNode;
}

function FieldShell({ label, error, hint, htmlFor, children }: FieldWrapperProps) {
  return (
    <div style={fieldShellStyle}>
      <label htmlFor={htmlFor} style={labelStyle}>
        {label}
      </label>
      {children}
      {error ? <p style={errorTextStyle}>{error}</p> : hint ? <p style={hintTextStyle}>{hint}</p> : null}
    </div>
  );
}

export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  { label, error, hint, id, style, onFocus, onBlur, ...rest },
  ref,
) {
  const fieldId = id ?? `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <FieldShell label={label} error={error} hint={hint} htmlFor={fieldId}>
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={Boolean(error)}
        style={{ ...baseControlStyle(Boolean(error)), ...style }}
        onFocus={(e) => {
          e.currentTarget.style.borderBottomWidth = "2px";
          onFocus?.(e);
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderBottomWidth = "1px";
          onBlur?.(e);
        }}
        {...rest}
      />
    </FieldShell>
  );
});

export interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(function TextAreaField(
  { label, error, hint, id, style, rows = 4, ...rest },
  ref,
) {
  const fieldId = id ?? `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <FieldShell label={label} error={error} hint={hint} htmlFor={fieldId}>
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        aria-invalid={Boolean(error)}
        style={{ ...baseControlStyle(Boolean(error)), resize: "vertical", ...style }}
        {...rest}
      />
    </FieldShell>
  );
});

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
  { label, error, hint, id, style, options, placeholder, ...rest },
  ref,
) {
  const fieldId = id ?? `field-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <FieldShell label={label} error={error} hint={hint} htmlFor={fieldId}>
      <select
        ref={ref}
        id={fieldId}
        aria-invalid={Boolean(error)}
        style={{ ...baseControlStyle(Boolean(error)), ...style }}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
});
