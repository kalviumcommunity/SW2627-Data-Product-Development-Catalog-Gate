import VendorDashboard from "../components/vendor/VendorDashboard";
import VendorUpload from "../components/vendor/VendorUpload";
import VendorPlaceholder from "../components/vendor/VendorPlaceholder";

export function VendorDashboardPage() {
  return <VendorDashboard />;
}

export function VendorUploadPage() {
  return <VendorUpload />;
}

export function VendorHistoryPage() {
  return <VendorPlaceholder title="History" />;
}

export function VendorValidationRulesPage() {
  return <VendorPlaceholder title="Validation Rules" />;
}

export { default as VendorLayout } from "../components/vendor/VendorLayout";
