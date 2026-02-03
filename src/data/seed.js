export const INITIAL_DEVOTIONALS = Array.from({ length: 30 }, (_, i) => ({
  id: `devo-${i}`,
  title: `Day ${i + 1}: The Grace of Beginning`,
  scripture: "Lamentations 3:22-23 (NLT)",
  scriptureText: "The faithful love of the Lord never ends! His mercies never cease. Great is his faithfulness; his mercies begin afresh each morning.",
  reflection: "We often think we need to 'fix' ourselves before coming to God. But grace meets us exactly where we are. Today is not about perfection; it is about presence. God is already here, waiting to speak to your heart.",
  prayer: "Lord, thank You for new mercies. Help me to stop striving and start resting in Your finished work. Amen.",
  action: "Take 5 minutes of silence today. No phone, no music. Just sit and say, 'Here I am, Lord.'",
  date: new Date(Date.now() - (i * 86400000)).toISOString() // Backdated
}));

export const COMMUNITY_COVENANT = [
  "We gather in humility, love, and truth.",
  "We center our conversation on Jesus Christ.",
  "We avoid political debate and doctrinal arguments.",
  "We seek to encourage, not to correct."
];
