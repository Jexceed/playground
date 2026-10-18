// Same-source evidence crops; provenance in specs/046-logic-house-visual-completeness/art-evidence.json.
export const logicEvidenceDefinitions = [
  {
    "id": "logic-story-evidence-1",
    "scene": "cakeKitchen",
    "evidenceFrames": [
      "cakeMissing",
      "cakeCream",
      "cakeDog",
      "cakeRabbit"
    ],
    "choiceImages": {
      "cat": "cakeCat",
      "dog": "cakeDog",
      "rabbit": "cakeRabbit"
    },
    "conceptChoices": {}
  },
  {
    "id": "logic-story-evidence-2",
    "scene": "cakeKitchen",
    "evidenceFrames": [
      "cakeMissing",
      "cakeCream",
      "cakeDog",
      "cakeRabbit"
    ],
    "choiceImages": {
      "cat": "cakeCat",
      "dog": "cakeDog"
    },
    "conceptChoices": {
      "same": {
        "symbol": "equal",
        "contextCard": null
      }
    }
  },
  {
    "id": "logic-story-evidence-3",
    "scene": "catKitchen",
    "evidenceFrames": [
      "weakCatContext",
      "weakCat"
    ],
    "choiceImages": {},
    "conceptChoices": {
      "not-yet": {
        "symbol": "question",
        "contextCard": "weakCat"
      },
      "enough": {
        "symbol": "statement",
        "contextCard": "weakCat"
      },
      "cat-no": {
        "symbol": "negative-claim",
        "contextCard": "weakCat"
      }
    }
  },
  {
    "id": "logic-story-evidence-4",
    "scene": "muddyYard",
    "evidenceFrames": [
      "mudPaws",
      "mudTracks",
      "mudCat",
      "mudRabbit"
    ],
    "choiceImages": {
      "rabbit": "mudRabbit",
      "cat": "mudCat",
      "dog": "mudDog"
    },
    "conceptChoices": {}
  },
  {
    "id": "logic-story-evidence-5",
    "scene": "spilledWater",
    "evidenceFrames": [
      "spillCup",
      "spillDog",
      "spillBird"
    ],
    "choiceImages": {
      "dog-area": "spillDog",
      "bird-area": "spillBird",
      "cup-area": "spillCup"
    },
    "conceptChoices": {}
  },
  {
    "id": "logic-story-evidence-6",
    "scene": "flowerGarden",
    "evidenceFrames": [
      "flowerBent",
      "flowerPollen",
      "flowerCat",
      "flowerRabbit"
    ],
    "choiceImages": {
      "rabbit": "flowerRabbit",
      "cat": "flowerCat"
    },
    "conceptChoices": {
      "same": {
        "symbol": "equal",
        "contextCard": null
      }
    }
  },
  {
    "id": "logic-story-evidence-7",
    "scene": "dogRoom",
    "evidenceFrames": [
      "weakDogContext",
      "weakDog",
      "weakToys"
    ],
    "choiceImages": {},
    "conceptChoices": {
      "enough": {
        "symbol": "statement",
        "contextCard": "weakDog"
      },
      "not-yet": {
        "symbol": "question",
        "contextCard": "weakDog"
      },
      "dog-no": {
        "symbol": "negative-claim",
        "contextCard": "weakDog"
      }
    }
  },
  {
    "id": "logic-condition-detective-8",
    "scene": "catKitchen",
    "evidenceFrames": [
      "weakCatContext",
      "weakCat"
    ],
    "choiceImages": {},
    "conceptChoices": {
      "enough": {
        "symbol": "statement",
        "contextCard": "weakCat"
      },
      "cat-no": {
        "symbol": "negative-claim",
        "contextCard": "weakCat"
      },
      "not-yet": {
        "symbol": "question",
        "contextCard": "weakCat"
      }
    }
  },
  {
    "id": "logic-condition-detective-9",
    "scene": "cakeKitchen",
    "evidenceFrames": [
      "cakeMissing",
      "cakeCream",
      "cakeDog",
      "cakeRabbit"
    ],
    "choiceImages": {
      "dog": "cakeDog",
      "cat": "cakeCat",
      "rabbit": "cakeRabbit"
    },
    "conceptChoices": {}
  },
  {
    "id": "logic-condition-detective-10",
    "scene": "spilledWater",
    "evidenceFrames": [
      "spillCup",
      "spillDog",
      "spillBird"
    ],
    "choiceImages": {
      "far-dog": "spillDog",
      "cup-area": "spillCup",
      "bird-window": "spillBird"
    },
    "conceptChoices": {}
  },
  {
    "id": "logic-condition-detective-11",
    "scene": "dogRoom",
    "evidenceFrames": [
      "weakDogContext",
      "weakDog",
      "weakToys"
    ],
    "choiceImages": {},
    "conceptChoices": {
      "not-yet": {
        "symbol": "question",
        "contextCard": "weakDog"
      },
      "enough": {
        "symbol": "statement",
        "contextCard": "weakDog"
      },
      "dog-no": {
        "symbol": "negative-claim",
        "contextCard": "weakDog"
      }
    }
  },
  {
    "id": "logic-fix-plan-8",
    "scene": "catKitchen",
    "evidenceFrames": [
      "weakCatContext",
      "weakCat"
    ],
    "choiceImages": {},
    "conceptChoices": {
      "enough": {
        "symbol": "statement",
        "contextCard": "weakCat"
      },
      "not-yet": {
        "symbol": "question",
        "contextCard": "weakCat"
      },
      "cat-no": {
        "symbol": "negative-claim",
        "contextCard": "weakCat"
      }
    }
  },
  {
    "id": "logic-fix-plan-9",
    "scene": "cakeKitchen",
    "evidenceFrames": [
      "cakeMissing",
      "cakeCream",
      "cakeDog",
      "cakeRabbit"
    ],
    "choiceImages": {
      "dog": "cakeDog",
      "cat": "cakeCat",
      "rabbit": "cakeRabbit"
    },
    "conceptChoices": {}
  },
  {
    "id": "logic-fix-plan-10",
    "scene": "spilledWater",
    "evidenceFrames": [
      "spillCup",
      "spillDog",
      "spillBird"
    ],
    "choiceImages": {
      "cup-area": "spillCup",
      "far-dog": "spillDog",
      "bird-window": "spillBird"
    },
    "conceptChoices": {}
  },
  {
    "id": "logic-priority-choice-8",
    "scene": "cakeKitchen",
    "evidenceFrames": [
      "cakeMissing",
      "cakeCream",
      "cakeDog",
      "cakeRabbit"
    ],
    "choiceImages": {
      "kitchen": "cakeKitchenContext",
      "cream": "cakeCream",
      "far": "cakeDog"
    },
    "conceptChoices": {}
  },
  {
    "id": "logic-priority-choice-9",
    "scene": "spilledWater",
    "evidenceFrames": [
      "spillCup",
      "spillDog",
      "spillBird"
    ],
    "choiceImages": {
      "far-dog": "spillDog",
      "cup-area": "spillCup",
      "window-bird": "spillBird"
    },
    "conceptChoices": {}
  },
  {
    "id": "logic-priority-choice-12",
    "scene": "dogRoom",
    "evidenceFrames": [
      "weakDogContext",
      "weakDog",
      "weakToys"
    ],
    "choiceImages": {},
    "conceptChoices": {
      "dog-certain": {
        "symbol": "certain-claim",
        "contextCard": "weakDog"
      },
      "dog-no": {
        "symbol": "negative-claim",
        "contextCard": "weakDog"
      },
      "more-clues": {
        "symbol": "search",
        "contextCard": "weakDog"
      }
    }
  }
];
