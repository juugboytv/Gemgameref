// --- GDD DATA MODULES ---
const formulas = {
  "derivedStats": {
    "MaximumHP": {
      "formula": "100 + (VIT * 10)",
      "description": "Calculates Maximum HP based on Vitality."
    },
    "ArmorClass": {
      "formula": "(Sum of AC from Gear) * (1 + (VIT * 0.0075))",
      "description": "Calculates Armor Class based on gear and Vitality."
    },
    "WeaponClass": {
      "True Fighter": {
        "formula": "(Sum of WC from Gear) * (1 + (DEX * 0.0055))",
        "scalingStat": "DEX"
      },
      "Martial Hybrid": {
        "formula": "(Sum of WC from Gear) * (1 + (DEX * 0.0055))",
        "scalingStat": "DEX"
      },
      "Mystic Hybrid": {
        "formula": "(Sum of WC from Gear) * (1 + (WIS * 0.0055))",
        "scalingStat": "WIS"
      },
      "Troll": {
        "formula": "(Sum of WC from Gear) * (1 + (VIT * 0.0055))",
        "scalingStat": "VIT",
        "specialCase": true
      }
    },
    "SpellClass": {
      "True Caster": {
        "formula": "(Sum of SC from Gear) * (1 + (WIS * 0.0055))",
        "scalingStat": "WIS"
      },
      "Martial Hybrid": {
        "formula": "(Sum of SC from Gear) * (1 + (DEX * 0.0055))",
        "scalingStat": "DEX"
      },
      "Mystic Hybrid": {
        "formula": "(Sum of SC from Gear) * (1 + (WIS * 0.0055))",
        "scalingStat": "WIS"
      },
      "Vampire": {
        "formula": "(Sum of SC from Gear) * (1 + (VIT * 0.0055))",
        "scalingStat": "VIT",
        "specialCase": true
      }
    },
    "HitChance": {
      "DEX_Based": {
        "formula": "90 + (DEX * 0.05)",
        "archetypes": ["True Fighter", "Martial Hybrid"]
      },
      "WIS_Based": {
        "formula": "90 + (WIS * 0.05)",
        "archetypes": ["True Caster", "Mystic Hybrid"]
      }
    },
    "CriticalHitChance": {
      "DEX_Based": {
        "formula": "5 + (DEX * 0.01)",
        "archetypes": ["True Fighter", "Martial Hybrid"]
      },
      "WIS_Based": {
        "formula": "5 + (WIS * 0.01)",
        "archetypes": ["True Caster", "Mystic Hybrid"]
      }
    },
    "RacialPower": {
      "SingleStat": {
        "formula": "PrimaryStat * 0.10"
      },
      "DualStat": {
        "formula": "(Stat1 * 0.05) + (Stat2 * 0.05)"
      }
    }
  },
  "combat": {
    "PlayerDamage": {
      "formula": "(90 * Player_WC_or_SC) / Monster_AC",
      "description": "Player damage is reduced by monster AC via division."
    },
    "MonsterDamage": {
      "formula": "Monster_Attack - (Player_AC * 0.5)",
      "description": "Monster damage is reduced by player AC via subtraction."
    },
    "SpellstrikeDamage": {
      "formula": "((90 * Player_WC) / Monster_AC + (90 * Player_SC) / Monster_AC) * 0.8",
      "description": "Hybrid damage from WC and SC, balanced by a 0.8x modifier."
    }
  },
  "progression": {
    "ExperienceToLevel": {
      "formula": "200 * (1.12 ^ Current_Level)",
      "description": "Exponential XP curve to create the 'Grind Wall'."
    },
    "MasteryXPToPoint": {
      "formula": "5000 * (1.15 ^ Current_Mastery_Points)",
      "description": "Steep exponential curve for Mastery Point acquisition."
    }
  },
  "healthAndResources": {
    "BaseHealthRegen": {
      "formula": "floor(5 + (PlayerLevel * 1.5))",
      "description": "Static, level-based HP regeneration per turn."
    },
    "GearHealthRegen": {
      "formula": "CurrentMaxHP * sum(%Regen FromAllSources)",
      "description": "Percentage-based HP regeneration from gear and effects."
    },
    "TotalHealthRegen": {
      "formula": "BaseRegen + floor(GearRegen)",
      "inCombatModifier": 0.5,
      "description": "Total HP regen per turn, reduced by 50% while in combat."
    }
  }
};

const races = {
  "human": { "raceName": "Human", "archetype": "True Fighter", "subArchetype": null, "specialistTitle": "Blademaster", "coreCombatIdentity": "The Versatile Duelist", "primaryStat": "DEX", "apAllocationWeights": { "STR": 15, "DEX": 20, "VIT": 10, "NTL": 5, "WIS": 5 }, "masteryAptitudes": { "Sword": 1, "Axe": null, "Mace": null, "Staff": null, "Dagger": null, "Claw": null, "Bow": null, "Armor": 2, "Dbl Hit": 3 } },
  "dragonborn": { "raceName": "Dragonborn", "archetype": "True Fighter", "subArchetype": null, "specialistTitle": "Blademaster", "coreCombatIdentity": "The Powerhouse Knight", "primaryStat": "DEX", "apAllocationWeights": { "STR": 18, "DEX": 20, "VIT": 12, "NTL": 2, "WIS": 3 }, "masteryAptitudes": { "Sword": 1, "Axe": null, "Mace": null, "Staff": null, "Dagger": null, "Claw": null, "Bow": null, "Armor": 2, "Dbl Hit": 3 } },
  "orc": { "raceName": "Orc", "archetype": "True Fighter", "subArchetype": null, "specialistTitle": "Mauler", "coreCombatIdentity": "The Definitive Mace Wielder", "primaryStat": "DEX", "apAllocationWeights": { "STR": 20, "DEX": 18, "VIT": 15, "NTL": 2, "WIS": 2 }, "masteryAptitudes": { "Sword": null, "Axe": null, "Mace": 1, "Staff": null, "Dagger": null, "Claw": null, "Bow": null, "Armor": 2, "Dbl Hit": 3 } },
  "werewolf": { "raceName": "Werewolf", "archetype": "True Fighter", "subArchetype": null, "specialistTitle": "Ravager", "coreCombatIdentity": "The Definitive Claw Wielder", "primaryStat": "DEX", "apAllocationWeights": { "STR": 15, "DEX": 22, "VIT": 13, "NTL": 2, "WIS": 3 }, "masteryAptitudes": { "Sword": null, "Axe": null, "Mace": null, "Staff": null, "Dagger": null, "Claw": 1, "Bow": null, "Armor": 2, "Dbl Hit": 3 } },
  "minotaur": { "raceName": "Minotaur", "archetype": "True Fighter", "subArchetype": null, "specialistTitle": "Executioner", "coreCombatIdentity": "The Definitive Axe Wielder", "primaryStat": "DEX", "apAllocationWeights": { "STR": 22, "DEX": 18, "VIT": 14, "NTL": 2, "WIS": 2 }, "masteryAptitudes": { "Sword": null, "Axe": 1, "Mace": null, "Staff": null, "Dagger": null, "Claw": null, "Bow": null, "Armor": 2, "Dbl Hit": 3 } },
  "troll": { "raceName": "Troll", "archetype": "True Fighter", "subArchetype": null, "specialistTitle": "Juggernaut", "coreCombatIdentity": "The Definitive Staff Wielder", "primaryStat": "VIT", "specialCase": "Damage scales with VIT instead of DEX.", "apAllocationWeights": { "STR": 10, "DEX": 5, "VIT": 25, "NTL": 5, "WIS": 5 }, "masteryAptitudes": { "Sword": null, "Axe": null, "Mace": null, "Staff": 1, "Dagger": null, "Claw": null, "Bow": null, "Armor": 2, "Dbl Hit": 3 } },
  "hobbit": { "raceName": "Hobbit", "archetype": "True Fighter", "subArchetype": null, "specialistTitle": "Cutthroat", "coreCombatIdentity": "The Definitive Dagger Wielder", "primaryStat": "DEX", "apAllocationWeights": { "STR": 8, "DEX": 25, "VIT": 12, "NTL": 3, "WIS": 7 }, "masteryAptitudes": { "Sword": null, "Axe": null, "Mace": null, "Staff": null, "Dagger": 1, "Claw": null, "Bow": null, "Armor": 2, "Dbl Hit": 3 } },
  "centaur": { "raceName": "Centaur", "archetype": "True Fighter", "subArchetype": null, "specialistTitle": "Sharpshooter", "coreCombatIdentity": "The Definitive Ranged Wielder", "primaryStat": "DEX", "apAllocationWeights": { "STR": 12, "DEX": 24, "VIT": 10, "NTL": 3, "WIS": 6 }, "masteryAptitudes": { "Sword": null, "Axe": null, "Mace": null, "Staff": null, "Dagger": null, "Claw": null, "Bow": 1, "Armor": 2, "Dbl Hit": 3 } },
  "phoenix": { "raceName": "Phoenix", "archetype": "True Caster", "subArchetype": null, "specialistTitle": "Pyromancer", "coreCombatIdentity": "The Explosive Pyromancer", "primaryStat": "WIS", "apAllocationWeights": { "STR": 2, "DEX": 3, "VIT": 10, "NTL": 20, "WIS": 20 }, "masteryAptitudes": { "Fire": 1, "Cold": null, "Earth": null, "Air": null, "Arcane": null, "Death": null, "Drain": null, "Armor": 3, "Dbl Hit": 3 } },
  "tiefling": { "raceName": "Tiefling", "archetype": "True Caster", "subArchetype": null, "specialistTitle": "Pyromancer", "coreCombatIdentity": "The Infernal Sorcerer", "primaryStat": "WIS", "apAllocationWeights": { "STR": 3, "DEX": 5, "VIT": 8, "NTL": 20, "WIS": 19 }, "masteryAptitudes": { "Fire": 1, "Cold": null, "Earth": null, "Air": null, "Arcane": null, "Death": null, "Drain": null, "Armor": 3, "Dbl Hit": 3 } },
  "mermaid": { "raceName": "Mermaid", "archetype": "True Caster", "subArchetype": null, "specialistTitle": "Cryomancer", "coreCombatIdentity": "The Definitive Cold Caster", "primaryStat": "WIS", "apAllocationWeights": { "STR": 2, "DEX": 4, "VIT": 12, "NTL": 19, "WIS": 18 }, "masteryAptitudes": { "Fire": null, "Cold": 1, "Earth": null, "Air": null, "Arcane": null, "Death": null, "Drain": null, "Armor": 3, "Dbl Hit": 3 } },
  "gnome": { "raceName": "Gnome", "archetype": "True Caster", "subArchetype": null, "specialistTitle": "Geomancer", "coreCombatIdentity": "The Definitive Earth Caster", "primaryStat": "WIS", "apAllocationWeights": { "STR": 4, "DEX": 2, "VIT": 14, "NTL": 20, "WIS": 15 }, "masteryAptitudes": { "Fire": null, "Cold": null, "Earth": 1, "Air": null, "Arcane": null, "Death": null, "Drain": null, "Armor": 3, "Dbl Hit": 3 } },
  "griffin": { "raceName": "Griffin", "archetype": "True Caster", "subArchetype": null, "specialistTitle": "Aeromancer", "coreCombatIdentity": "The Definitive Air Caster", "primaryStat": "WIS", "apAllocationWeights": { "STR": 2, "DEX": 8, "VIT": 8, "NTL": 17, "WIS": 20 }, "masteryAptitudes": { "Fire": null, "Cold": null, "Earth": null, "Air": 1, "Arcane": null, "Death": null, "Drain": null, "Armor": 3, "Dbl Hit": 3 } },
  "vampire": { "raceName": "Vampire", "archetype": "True Caster", "subArchetype": null, "specialistTitle": "Sanguinist", "coreCombatIdentity": "The Definitive Drain Caster", "primaryStat": "VIT", "specialCase": "Damage scales with VIT instead of WIS.", "apAllocationWeights": { "STR": 5, "DEX": 5, "VIT": 25, "NTL": 10, "WIS": 5 }, "masteryAptitudes": { "Fire": null, "Cold": null, "Earth": null, "Air": null, "Arcane": null, "Death": null, "Drain": 1, "Armor": 3, "Dbl Hit": 3 } },
  "elf": { "raceName": "Elf", "archetype": "True Caster", "subArchetype": null, "specialistTitle": "Arcanist", "coreCombatIdentity": "The Definitive Arcane Caster", "primaryStat": "WIS", "apAllocationWeights": { "STR": 2, "DEX": 7, "VIT": 7, "NTL": 20, "WIS": 19 }, "masteryAptitudes": { "Fire": null, "Cold": null, "Earth": null, "Air": null, "Arcane": 1, "Death": null, "Drain": null, "Armor": 3, "Dbl Hit": 3 } },
  "babaYaga": { "raceName": "Baba Yaga", "archetype": "True Caster", "subArchetype": null, "specialistTitle": "Necromancer", "coreCombatIdentity": "The Definitive Death Caster", "primaryStat": "WIS", "apAllocationWeights": { "STR": 3, "DEX": 2, "VIT": 10, "NTL": 19, "WIS": 21 }, "masteryAptitudes": { "Fire": null, "Cold": null, "Earth": null, "Air": null, "Arcane": null, "Death": 1, "Drain": null, "Armor": 3, "Dbl Hit": 3 } },
  "angel": { "raceName": "Angel", "archetype": "Hybrid", "subArchetype": "Martial Hybrid", "primaryStat": "DEX", "apAllocationWeights": { "STR": 12, "DEX": 18, "VIT": 8, "NTL": 8, "WIS": 9 }, "masteryAptitudes": { "Sword": 2, "Axe": null, "Mace": null, "Staff": null, "Dagger": null, "Claw": null, "Bow": null, "Fire": null, "Cold": null, "Earth": null, "Air": null, "Arcane": 2, "Death": null, "Drain": null, "Armor": 3, "Dbl Hit": 3 } },
  "aasimar": { "raceName": "Aasimar", "archetype": "Hybrid", "subArchetype": "Martial Hybrid", "primaryStat": "DEX", "apAllocationWeights": { "STR": 14, "DEX": 18, "VIT": 9, "NTL": 7, "WIS": 7 }, "masteryAptitudes": { "Sword": null, "Axe": null, "Mace": 2, "Staff": null, "Dagger": null, "Claw": null, "Bow": null, "Fire": null, "Cold": null, "Earth": null, "Air": null, "Arcane": 2, "Death": null, "Drain": null, "Armor": 3, "Dbl Hit": 3 } },
  "banshee": { "raceName": "Banshee", "archetype": "Hybrid", "subArchetype": "Martial Hybrid", "primaryStat": "DEX", "apAllocationWeights": { "STR": 6, "DEX": 20, "VIT": 7, "NTL": 9, "WIS": 13 }, "masteryAptitudes": { "Sword": null, "Axe": null, "Mace": null, "Staff": null, "Dagger": 2, "Claw": null, "Bow": null, "Fire": null, "Cold": null, "Earth": null, "Air": null, "Arcane": 2, "Death": null, "Drain": null, "Armor": 3, "Dbl Hit": 3 } },
  "halfling": { "raceName": "Halfling", "archetype": "Hybrid", "subArchetype": "Martial Hybrid", "primaryStat": "DEX", "apAllocationWeights": { "STR": 7, "DEX": 21, "VIT": 10, "NTL": 7, "WIS": 10 }, "masteryAptitudes": { "Sword": null, "Axe": null, "Mace": null, "Staff": 2, "Dagger": null, "Claw": null, "Bow": null, "Fire": null, "Cold": null, "Earth": null, "Air": null, "Arcane": 2, "Death": null, "Drain": null, "Armor": 3, "Dbl Hit": "B" } },
  "dwarf": { "raceName": "Dwarf", "archetype": "Hybrid", "subArchetype": "Mystic Hybrid", "primaryStat": "WIS", "apAllocationWeights": { "STR": 12, "DEX": 8, "VIT": 10, "NTL": 12, "WIS": 18 }, "masteryAptitudes": { "Sword": null, "Axe": 2, "Mace": null, "Staff": null, "Dagger": null, "Claw": null, "Bow": null, "Fire": 2, "Cold": null, "Earth": null, "Air": null, "Arcane": null, "Death": null, "Drain": null, "Armor": 3, "Dbl Hit": "B" } },
  "demon": { "raceName": "Demon", "archetype": "Hybrid", "subArchetype": "Mystic Hybrid", "primaryStat": "WIS", "apAllocationWeights": { "STR": 10, "DEX": 8, "VIT": 8, "NTL": 15, "WIS": 19 }, "masteryAptitudes": { "Sword": null, "Axe": null, "Mace": null, "Staff": 2, "Dagger": null, "Claw": null, "Bow": null, "Fire": 2, "Cold": null, "Earth": null, "Air": null, "Arcane": null, "Death": null, "Drain": null, "Armor": 3, "Dbl Hit": "B" } },
  "draugr": { "raceName": "Draugr", "archetype": "Hybrid", "subArchetype": "Mystic Hybrid", "primaryStat": "WIS", "apAllocationWeights": { "STR": 13, "DEX": 6, "VIT": 12, "NTL": 12, "WIS": 17 }, "masteryAptitudes": { "Sword": null, "Axe": null, "Mace": null, "Staff": 2, "Dagger": null, "Claw": null, "Bow": null, "Fire": null, "Cold": null, "Earth": null, "Air": null, "Arcane": null, "Death": 2, "Drain": null, "Armor": 3, "Dbl Hit": 3 } },
  "unicorn": { "raceName": "Unicorn", "archetype": "Hybrid", "subArchetype": "Mystic Hybrid", "primaryStat": "WIS", "apAllocationWeights": { "STR": 8, "DEX": 10, "VIT": 9, "NTL": 13, "WIS": 20 }, "masteryAptitudes": { "Sword": 2, "Axe": null, "Mace": null, "Staff": null, "Dagger": null, "Claw": null, "Bow": null, "Fire": null, "Cold": null, "Earth": null, "Air": null, "Arcane": null, "Death": 2, "Drain": null, "Armor": 3, "Dbl Hit": 3 } }
};

const progression = {
  "dropperTiers": [
    { "tier": 1, "minLevelReq": 1, "goldCostPerPiece": 50000, "classValue": 13.00, "attributeRequirements": { "STR": 5, "NTL": 5, "VIT": 5 } },
    { "tier": 2, "minLevelReq": 1, "goldCostPerPiece": 87500, "classValue": 15.86, "attributeRequirements": { "STR": 15, "NTL": 15, "VIT": 20 } },
    { "tier": 3, "minLevelReq": 100, "goldCostPerPiece": 153125, "classValue": 19.35, "attributeRequirements": { "STR": 25, "NTL": 25, "VIT": 35 } },
    { "tier": 4, "minLevelReq": 135, "goldCostPerPiece": 267968, "classValue": 23.61, "attributeRequirements": { "STR": 40, "NTL": 40, "VIT": 50 } },
    { "tier": 5, "minLevelReq": 184, "goldCostPerPiece": 468945, "classValue": 28.80, "attributeRequirements": { "STR": 55, "NTL": 55, "VIT": 70 } },
    { "tier": 6, "minLevelReq": 253, "goldCostPerPiece": 820654, "classValue": 35.14, "attributeRequirements": { "STR": 70, "NTL": 70, "VIT": 90 } },
    { "tier": 7, "minLevelReq": 386, "goldCostPerPiece": 1436145, "classValue": 42.87, "attributeRequirements": { "STR": 90, "NTL": 90, "VIT": 110 } },
    { "tier": 8, "minLevelReq": 1000, "goldCostPerPiece": 2513253, "classValue": 52.30, "attributeRequirements": { "STR": 110, "NTL": 110, "VIT": 135 } },
    { "tier": 9, "minLevelReq": 3571, "goldCostPerPiece": 4398193, "classValue": 63.81, "attributeRequirements": { "STR": 130, "NTL": 130, "VIT": 160 } },
    { "tier": 10, "minLevelReq": 6143, "goldCostPerPiece": 7696838, "classValue": 77.85, "attributeRequirements": { "STR": 155, "NTL": 155, "VIT": 190 } },
    { "tier": 11, "minLevelReq": 8714, "goldCostPerPiece": 13469467, "classValue": 94.97, "attributeRequirements": { "STR": 180, "NTL": 180, "VIT": 220 } },
    { "tier": 12, "minLevelReq": 17272, "goldCostPerPiece": 23571567, "classValue": 115.87, "attributeRequirements": { "STR": 205, "NTL": 205, "VIT": 250 } },
    { "tier": 13, "minLevelReq": 28180, "goldCostPerPiece": 41250242, "classValue": 141.36, "attributeRequirements": { "STR": 230, "NTL": 230, "VIT": 285 } },
    { "tier": 14, "minLevelReq": 39088, "goldCostPerPiece": 72187924, "classValue": 172.46, "attributeRequirements": { "STR": 260, "NTL": 260, "VIT": 320 } },
    { "tier": 15, "minLevelReq": 50000, "goldCostPerPiece": 126328867, "classValue": 210.40, "attributeRequirements": { "STR": 290, "NTL": 290, "VIT": 355 } },
    { "tier": 16, "minLevelReq": 83333, "goldCostPerPiece": 221075517, "classValue": 256.69, "attributeRequirements": { "STR": 320, "NTL": 320, "VIT": 395 } },
    { "tier": 17, "minLevelReq": 127777, "goldCostPerPiece": 386882155, "classValue": 313.16, "attributeRequirements": { "STR": 350, "NTL": 350, "VIT": 435 } },
    { "tier": 18, "minLevelReq": 172222, "goldCostPerPiece": 677043771, "classValue": 382.06, "attributeRequirements": { "STR": 385, "NTL": 385, "VIT": 475 } },
    { "tier": 19, "minLevelReq": 216666, "goldCostPerPiece": 1184826599, "classValue": 466.11, "attributeRequirements": { "STR": 420, "NTL": 420, "VIT": 520 } },
    { "tier": 20, "minLevelReq": 400000, "goldCostPerPiece": 2073446549, "classValue": 568.65, "attributeRequirements": { "STR": 455, "NTL": 455, "VIT": 565 } }
  ],
  "dropperSlotModifiers": {
    "Weapon": { "statProportionality": 1.0, "statType": "WC" },
    "Spell": { "statProportionality": 1.0, "statType": "SC" },
    "Armor": { "statProportionality": 1.0, "statType": "AC" },
    "Helmet": { "statProportionality": 0.75, "statType": "AC" },
    "Boots": { "statProportionality": 0.75, "statType": "AC" },
    "Leggings": { "statProportionality": 0.50, "statType": "AC", "specialBonus": { "stat": "Hit Chance", "value": 0.10 } },
    "Gauntlets": { "statProportionality": 0.50, "statType": "AC", "specialBonus": { "stat": "WC/SC", "value": 0.15 } }
  },
  "gemGradeTiers": [
    { "gradeTier": 1, "unlockLevel": 1, "correspondingZone": "Z01-Z24" },
    { "gradeTier": 2, "unlockLevel": 100, "correspondingZone": "Z25" },
    { "gradeTier": 3, "unlockLevel": 253, "correspondingZone": "Z34" },
    { "gradeTier": 4, "unlockLevel": 1000, "correspondingZone": "Z51" },
    { "gradeTier": 5, "unlockLevel": 6143, "correspondingZone": "Z59" },
    { "gradeTier": 6, "unlockLevel": 13636, "correspondingZone": "Z66" },
    { "gradeTier": 7, "unlockLevel": 35452, "correspondingZone": "Z72" },
    { "gradeTier": 8, "unlockLevel": 83333, "correspondingZone": "Z79" },
    { "gradeTier": 9, "unlockLevel": 172222, "correspondingZone": "Z87" }
  ]
};

const gems = {
  "standard": {
    "loreStone": { "id": "loreStone", "name": "LoreStone", "category": "Caster", "color": "Blue", "effect": "Increase Base Spell Class", "grades": [1.5, 2.5, 3.5, 5, 7, 9, 11, 13, 15] },
    "mindrite": { "id": "mindrite", "name": "Mindrite", "category": "Caster", "color": "Blue", "effect": "Increase Wisdom", "grades": [5, 7.5, 10, 12.5, 15, 20, 30, 40, 50] },
    "dullrite": { "id": "dullrite", "name": "Dullrite", "category": "Caster", "color": "Blue", "effect": "Decrease Enemy Wisdom", "grades": [8, 10, 12, 14, 16, 19, 22, 26, 30] },
    "drainrite": { "id": "drainrite", "name": "Drainrite", "category": "Caster", "color": "Blue", "effect": "Steal Enemy Wisdom", "grades": [4, 6, 9, 15, 25, 40, 50, 60, 75] },
    "mindStone": { "id": "mindStone", "name": "MindStone", "category": "Caster", "color": "Blue", "effect": "Increase Intelligence", "grades": [5, 7.5, 10, 12.5, 15, 20, 30, 40, 50] },
    "dullStone": { "id": "dullStone", "name": "DullStone", "category": "Caster", "color": "Blue", "effect": "Decrease Enemy Intelligence", "grades": [8, 10, 12, 14, 16, 19, 22, 26, 30] },
    "drawStone": { "id": "drawStone", "name": "DrawStone", "category": "Caster", "color": "Blue", "effect": "Steal Enemy Intelligence", "grades": [4, 6, 9, 15, 25, 40, 50, 60, 75] },
    "warStone": { "id": "warStone", "name": "WarStone", "category": "Fighter", "color": "Red", "effect": "Increase Base Weapon Class", "grades": [1.5, 2.5, 3.5, 5, 7, 9, 11, 13, 15] },
    "mightrite": { "id": "mightrite", "name": "Mightrite", "category": "Fighter", "color": "Red", "effect": "Increase Dexterity", "grades": [5, 7.5, 10, 12.5, 15, 20, 30, 40, 50] },
    "cripplite": { "id": "cripplite", "name": "Cripplite", "category": "Fighter", "color": "Red", "effect": "Decrease Enemy Dexterity", "grades": [8, 10, 12, 14, 16, 19, 22, 26, 30] },
    "siphilite": { "id": "siphilite", "name": "Siphilite", "category": "Fighter", "color": "Red", "effect": "Steal Enemy Dexterity", "grades": [4, 6, 9, 15, 25, 40, 50, 60, 75] },
    "mightStone": { "id": "mightStone", "name": "MightStone", "category": "Fighter", "color": "Red", "effect": "Increase Strength", "grades": [5, 7.5, 10, 12.5, 15, 20, 30, 40, 50] },
    "weakStone": { "id": "weakStone", "name": "WeakStone", "category": "Fighter", "color": "Red", "effect": "Decrease Enemy Strength", "grades": [8, 10, 12, 14, 16, 19, 22, 26, 30] },
    "sapStone": { "id": "sapStone", "name": "SapStone", "category": "Fighter", "color": "Red", "effect": "Steal Enemy Strength", "grades": [4, 6, 9, 15, 25, 40, 50, 60, 75] },
    "obsidianHeart": { "id": "obsidianHeart", "name": "Obsidian Heart", "category": "Misc", "color": "Green", "effect": "Increase Base Armor Class", "grades": [1.5, 2.5, 3.5, 5, 7, 9, 11, 13, 15] },
    "spikeCore": { "id": "spikeCore", "name": "Spike-Core", "category": "Misc", "color": "Yellow", "effect": "Increase Critical Hit Chance", "grades": [1, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20] },
    "trueCore": { "id": "trueCore", "name": "True-Core", "category": "Misc", "color": "Green", "effect": "Increase Hit Chance", "grades": [3, 6, 9, 12, 15, 18, 21, 25, 30] },
    "veilCore": { "id": "veilCore", "name": "Veil-Core", "category": "Misc", "color": "Green", "effect": "Decrease Enemy Hit Chance", "grades": [2.7, 5.4, 8.1, 10.8, 13.5, 16.2, 18.9, 22.5, 27] },
    "vitalCore": { "id": "vitalCore", "name": "Vital-Core", "category": "Misc", "color": "Green", "effect": "Increase Vitality", "grades": [5, 7.5, 10, 12.5, 15, 20, 30, 40, 50] },
    "bloodCore": { "id": "bloodCore", "name": "Blood-Core", "category": "Misc", "color": "Green", "effect": "Steal Enemy Health", "grades": [4, 6, 9, 15, 25, 40, 50, 60, 75] },
    "shadowCore": { "id": "shadowCore", "name": "Shadow-Core", "category": "Misc", "color": "Yellow", "effect": "Increase Shadow Drop Chance", "grades": [8, 10, 12, 14, 16, 19, 22, 26, 30] },
    "treasureCore": { "id": "treasureCore", "name": "Treasure-Core", "category": "Misc", "color": "Yellow", "effect": "Increase Drop Chance", "grades": [2, 3, 4, 5, 6, 7, 8, 9, 10] },
    "ascendCore": { "id": "ascendCore", "name": "Ascend-Core", "category": "Misc", "color": "Yellow", "effect": "Increase Experience Gain", "grades": [2, 4, 6, 9, 12, 15, 19, 24, 30] },
    "midasCore": { "id": "midasCore", "name": "Midas-Core", "category": "Misc", "color": "Yellow", "effect": "Increase Gold Earned", "grades": [2, 4, 6, 9, 12, 15, 19, 24, 30] },
    "masterworkCore": { "id": "masterworkCore", "name": "Masterwork-Core", "category": "Misc", "color": "Yellow", "effect": "Increase Mastery Chance", "grades": [5, 10, 15, 20, 25, 30, 35, 40, 50] },
    "echoingCore": { "id": "echoingCore", "name": "Echoing-Core", "category": "Misc", "color": "Yellow", "effect": "Increase Double Hit Chance", "grades": [2, 3, 4, 5, 6, 7, 8, 10, 12] },
    "harvesterCore": { "id": "harvesterCore", "name": "Harvester-Core", "category": "Misc", "color": "Yellow", "effect": "Increase Resource Drop Chance", "grades": [5, 10, 15, 20, 30, 50, 55, 60, 75] }
  },
  "fusion": [
    { "id": "warHeart", "name": "WarHeart", "recipe": ["warStone", "obsidianHeart"], "effects": [ { "effect": "Inc. Base WC", "grades": [1.5, 2.5, 3.5, 5, 7, 9, 11, 13, 15] }, { "effect": "Inc. Base AC", "grades": [1.5, 2.5, 3.5, 5, 7, 9, 11, 13, 15] } ] },
    { "id": "loreHeart", "name": "LoreHeart", "recipe": ["loreStone", "obsidianHeart"], "effects": [ { "effect": "Inc. Base SC", "grades": [1.5, 2.5, 3.5, 5, 7, 9, 11, 13, 15] }, { "effect": "Inc. Base AC", "grades": [1.5, 2.5, 3.5, 5, 7, 9, 11, 13, 15] } ] },
    { "id": "trueRite", "name": "True-Rite", "recipe": ["trueCore", "dullrite"], "effects": [ { "effect": "Inc. Hit Chance", "grades": [3, 6, 9, 12, 15, 18, 21, 25, 30] }, { "effect": "Dec. Enemy WIS", "grades": [8, 10, 12, 14, 16, 19, 22, 26, 30] } ] },
    { "id": "trueLite", "name": "True-Lite", "recipe": ["trueCore", "cripplite"], "effects": [ { "effect": "Inc. Hit Chance", "grades": [3, 6, 9, 12, 15, 18, 21, 25, 30] }, { "effect": "Dec. Enemy DEX", "grades": [8, 10, 12, 14, 16, 19, 22, 26, 30] } ] },
    { "id": "shadowTreasure", "name": "Shadow Treasure", "recipe": ["shadowCore", "treasureCore"], "effects": [ { "effect": "Inc. Shadow Drop", "grades": [8, 10, 12, 14, 16, 19, 22, 26, 30] }, { "effect": "Inc. Drop Chance", "grades": [2, 3, 4, 5, 6, 7, 8, 9, 10] } ] }
  ]
};