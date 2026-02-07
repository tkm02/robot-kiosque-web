export interface LocationNode {
  label: string
  value: string
  children?: LocationNode[]
}

export const IVORY_COAST_LOCATIONS: LocationNode[] = [
  {
    label: "District Autonome d'Abidjan",
    value: "abidjan",
    children: [
      { label: "Abidjan", value: "abidjan_reg", children: [
        { label: "Abobo", value: "abobo" },
        { label: "Adjamé", value: "adjame" },
        { label: "Attécoubé", value: "attecoube" },
        { label: "Cocody", value: "cocody" },
        { label: "Koumassi", value: "koumassi" },
        { label: "Marcory", value: "marcory" },
        { label: "Plateau", value: "plateau" },
        { label: "Port-Bouët", value: "port_bouet" },
        { label: "Treichville", value: "treichville" },
        { label: "Yopougon", value: "yopougon" },
        { label: "Anyama", value: "anyama" },
        { label: "Bingerville", value: "bingerville" },
        { label: "Songon", value: "songon" }
      ]}
    ]
  },
  {
    label: "District Autonome de Yamoussoukro",
    value: "yamoussoukro",
    children: [
      { label: "Bélier", value: "belier", children: [
        { label: "Yamoussoukro", value: "yamoussoukro_com" },
        { label: "Attiégouakro", value: "attiegouakro" }
      ]}
    ]
  },
  {
    label: "District du Bas-Sassandra",
    value: "bas_sassandra",
    children: [
      { label: "Nawa", value: "nawa", children: [
        { label: "Soubré", value: "soubre" },
        { label: "Méagui", value: "meagui" },
        { label: "Buyo", value: "buyo" },
        { label: "Gueyo", value: "gueyo" }
      ]},
      { label: "San-Pédro", value: "san_pedro_reg", children: [
        { label: "San-Pédro", value: "san_pedro_com" },
        { label: "Tabou", value: "tabou" }
      ]},
      { label: "Grands-Ponts", value: "grands_ponts", children: [
        { label: "Dabou", value: "dabou" },
        { label: "Grand-Lahou", value: "grand_lahou" },
        { label: "Jacqueville", value: "jacqueville" }
      ]}
    ]
  }
  // Note: This is an extract for demonstration. In a real app, we would include all 14 districts and 31 regions.
]
