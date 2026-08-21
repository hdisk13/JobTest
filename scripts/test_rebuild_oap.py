#!/usr/bin/env python3
"""Formula-level checks for Appendix E. Table QC lives in rebuild + TS tests."""

from __future__ import annotations

import unittest
from decimal import Decimal
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
from rebuild_oap import dimension_score, half_up_2


class AppendixEFormulas(unittest.TestCase):
    def test_half_up_not_banker(self) -> None:
        # 10.025 would banker's-round to 10.02; half-up is 10.03.
        self.assertEqual(half_up_2(Decimal("10.025")), Decimal("10.03"))
        self.assertEqual(half_up_2(Decimal("8.2575")), Decimal("8.26"))
        self.assertEqual(half_up_2(Decimal("10.05333333333333333333333333")), Decimal("10.05"))

    def test_single_descriptor_is_imp_plus_lvl(self) -> None:
        self.assertEqual(
            dimension_score([Decimal("2.75")], [Decimal("2.88")]),
            Decimal("5.63"),
        )

    def test_fixed_denominator_mean_imp_plus_mean_lvl(self) -> None:
        # Actuaries AR inputs
        im = [Decimal("4.93"), Decimal("4.25"), Decimal("4.62")]
        lv = [Decimal("6.36"), Decimal("5.00"), Decimal("5.00")]
        self.assertEqual(dimension_score(im, lv), Decimal("10.05"))


if __name__ == "__main__":
    unittest.main()
