import * as React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { SyntheticMatchKind, SyntheticSearchListing } from '@medifind/contracts';

import { strings } from '../content/strings';
import { formatFjd } from '../search/format';
import type { DisplayDistance } from '../search/distance';
import { spacing, typography } from '../theme/tokens';
import { useThemeColors } from '../theme/useTheme';
import { StatusBadge } from './StatusBadge';
import { availabilityPresentation, matchKindLabel } from './statusPresentation';

export interface ResultCardProps {
  listing: SyntheticSearchListing;
  matchKind: SyntheticMatchKind;
  displayDistance: DisplayDistance;
  showDistance: boolean;
  onPress: () => void;
}

export function ResultCard({
  listing,
  matchKind,
  displayDistance,
  showDistance,
  onPress,
}: ResultCardProps) {
  const colors = useThemeColors();
  const availability = availabilityPresentation(listing.availability);
  const priceText = formatFjd(listing.priceFjdMinor);

  const accessibilityLabel = [
    listing.medicineDisplayName,
    matchKindLabel(matchKind),
    listing.pharmacyDisplayName,
    availability.label,
    priceText,
    listing.freshness === 'may_be_outdated' ? strings.freshnessMayBeOutdatedLabel : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <Text style={[styles.matchKind, { color: colors.info }]}>{matchKindLabel(matchKind)}</Text>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
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

      <Text style={[styles.supporting, { color: colors.textSecondary }]}>
        {listing.pharmacyDisplayName}
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

      <View style={styles.footerRow}>
        <Text style={[styles.price, { color: colors.textPrimary }]}>{priceText}</Text>
        <Text style={[styles.supporting, { color: colors.textSecondary }]}>
          {strings.lastUpdatedPrefix}: {listing.lastUpdatedDisplay}
        </Text>
      </View>

      {showDistance ? (
        <Text style={[styles.supporting, { color: colors.textSecondary }]}>
          {displayDistance.label}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  matchKind: {
    fontSize: typography.micro.fontSize,
    lineHeight: typography.micro.lineHeight,
    fontWeight: typography.micro.fontWeight,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: typography.heading.fontSize,
    lineHeight: typography.heading.lineHeight,
    fontWeight: typography.heading.fontWeight,
  },
  supporting: {
    fontSize: typography.supporting.fontSize,
    lineHeight: typography.supporting.lineHeight,
  },
  statusRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  price: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontWeight: '600',
  },
});
