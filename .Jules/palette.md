
## 2024-05-18 - Missing ARIA labels in icon-only buttons
**Learning:** Found multiple icon-only `TouchableOpacity` instances without `accessibilityLabel` or `accessibilityRole="button"`, making them difficult to interact with via screen readers in React Native.
**Action:** When adding new interactive icons inside `TouchableOpacity`, proactively include both an `accessibilityRole="button"` and a localized, descriptive `accessibilityLabel`.
