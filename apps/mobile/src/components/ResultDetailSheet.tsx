import * as React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { SyntheticMatchKind, SyntheticSearchListing } from '@medifind/contracts';

import { strings } from '../content/strings';
import { formatFjd } from '../search/format';
import type { DisplayDistance } from '../search/distance';
import { spacing, typography } from '../theme/tokens';
import { useThemeColors } from '../theme/useTheme';
import { StatusBadge } from './StatusBadge';
import { availabilityPresentation, matchKindLabel } from './statusPresentation';

export interface ResultDetailSheetProps {
  listing: SyntheticSearchListing;
  matchKind: SyntheticMatchKind;
  displayDistance: DisplayDistance;
  onClose: () => void;
}

/**
 * A local, read-only detail sheet. It has no call, map, reservation,
 * upload or request action — only identity, pack, pharmacy attribution,
 * price/freshness and the required safety copy.
 */
export function ResultDetailSheet({
  listing,
  matchKind,
  displayDistance,
  onClose,
}: ResultDetailSheetProps) {
  const colors = useThemeColors();
  const availability = availabilityPresentation(listing.availability);

  return (
    <View
      accessibilityViewIsModal
      style={[styles.overlay, { backgroundColor: colors.canvas }]}
      testID="result-detail-sheet"
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]} accessibilityRole="header">
          {strings.detailSheetTitle}
        </Text>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={strings.detailSheetCloseLabel}
          style={styles.closeButton}
        >
          <Text style={{ color: colors.primary }}>✕</Text>
        </Pressable>
      </View>

      <ScrollView>
        <Text style={[styles.matchKind, { color: colors.info }]}>{matchKindLabel(matchKind)}</Text>
        <Text style={[styles.medicineName, { color: colors.textPrimary }]}>
          {listing.medicineDisplayName}
        </Text>
        {listing.brandName ? (
          <Text style={[styles.supporting, { color: colors.textSecondary }]}>
            {listing.brandName}
          </Text>
        ) : null}
        <Text style={[styles.supporting, { color: colors.textSecondary }]}>
          {listing.strength} · {listing.dosageForm} · {listing.packDescription}
        </Text>

        <Text style={[styles.pharmacyLine, { color: colors.textPrimary }]}>
          {strings.detailSheetPharmacyPrefix} {listing.pharmacyDisplayName}
        </Text>
        <Text style={[styles.supporting, { color: colors.textSecondary }]}>
          {displayDistance.label}
        </Text>

        <View style={styles.statusRow}>
          <StatusBadge
            label={availability.label}
            tone={availability.tone}
            glyph={availability.glyph}
          />
          {listing.freshness === 'may_be_outdated' ? (
            <StatusBadge label={strings.freshnessMayBeOutdatedLabel} tone="warning" glyph="⏱" />
          ) : null}
        </View>

        <Text style={[styles.price, { color: colors.textPrimary }]}>
          {formatFjd(listing.priceFjdMinor)}
        </Text>
        <Text style={[styles.supporting, { color: colors.textSecondary }]}>
          {strings.lastUpdatedPrefix}: {listing.lastUpdatedDisplay}
        </Text>

        <View style={[styles.safetyBlock, { backgroundColor: colors.surfaceMuted }]}>
          <Text style={[styles.safetyText, { color: colors.textPrimary }]}>
            {strings.safetyAvailabilityPrice}
          </Text>
          <Text style={[styles.safetyText, { color: colors.textPrimary }]}>
            {strings.safetyReservationNoGuarantee}
          </Text>
          <Text style={[styles.safetyText, { color: colors.textPrimary }]}>
            {strings.safetyPrescriptionMayBeRequired}
          </Text>
          <Text style={[styles.safetyText, { color: colors.textPrimary }]}>
            {strings.safetyNoMedicalAdvice}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  closeButton: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.title.fontSize,
    lineHeight: typography.title.lineHeight,
    fontWeight: typography.title.fontWeight,
  },
  matchKind: {
    fontSize: typography.micro.fontSize,
    fontWeight: typography.micro.fontWeight,
    textTransform: 'uppercase',
  },
  medicineName: {
    fontSize: typography.heading.fontSize,
    lineHeight: typography.heading.lineHeight,
    fontWeight: typography.heading.fontWeight,
    marginTop: spacing.xs,
  },
  supporting: {
    fontSize: typography.supporting.fontSize,
    lineHeight: typography.supporting.lineHeight,
  },
  pharmacyLine: {
    fontSize: typography.body.fontSize,
    marginTop: spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  price: {
    fontSize: typography.title.fontSize,
    fontWeight: '600',
    marginTop: spacing.md,
  },
  safetyBlock: {
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: 12,
    gap: spacing.xs,
  },
  safetyText: {
    fontSize: typography.supporting.fontSize,
    lineHeight: typography.supporting.lineHeight,
  },
});
