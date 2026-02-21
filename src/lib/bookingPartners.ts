export interface BookingPartner {
  name: string;
  url: string;
  color: string;
  textColor?: string;
  iconUrl: string;
}

export const BOOKING_PARTNERS: BookingPartner[] = [
  {
    name: "Airbnb",
    url: "https://www.airbnb.com/experiences/588791?location=Rethymno%2C%20Crete%2C%20Greece&currentTab=experience_tab&federatedSearchId=a13831c1-c2e6-40ce-bd51-d9353d631895&searchId=8099acdc-de96-41a2-9132-c2bcc995d40c&sectionId=2cae4bf8-1b46-4ac3-b94e-86f47a94815e&source=p2",
    color: "#FF5A5F",
    textColor: "#FFFFFF",
    iconUrl: "https://www.google.com/s2/favicons?domain=airbnb.com&sz=64",
  },
  {
    name: "Eatwith",
    url: "https://www.eatwith.com/events/22470?date=2026-04-20",
    color: "#FF6B35",
    textColor: "#FFFFFF",
    iconUrl: "https://www.google.com/s2/favicons?domain=eatwith.com&sz=64",
  },
  {
    name: "TripAdvisor",
    url: "https://www.tripadvisor.com/AttractionProductReview-g189429-d16642045-Cretan_Cooking_Class_and_Dinner_Evening_in_a_Rethymno_Home-Kythnos_Cyclades_South_.html",
    color: "#00AA6C",
    textColor: "#FFFFFF",
    iconUrl: "https://www.google.com/s2/favicons?domain=tripadvisor.com&sz=64",
  },
  {
    name: "Viator",
    url: "https://www.viator.com/tours/Cyclades-Islands/COOKING-LESSON-AND-MEAL-BASED-ON-CRETAN-CUISINE/d957-75909P89",
    color: "#00AA6C",
    textColor: "#FFFFFF",
    iconUrl: "https://www.google.com/s2/favicons?domain=viator.com&sz=64",
  },
];
