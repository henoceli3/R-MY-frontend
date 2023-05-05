import dynamic from 'next/dynamic';
const Searchable = dynamic(() => import('react-searchable-dropdown'), { ssr: false });

export default function Selectoptions() {
  return (
    <div >
      <Searchable className="form-control select2 "
        value="test"
        placeholder="faite un choix" // by default "Search"
        notFoundText="pas de reponse trouver" // by default "No result found"
        noInput
        options={[
          {
            value: "",
            label: "All categories"

          },
          {
            value: "Obligation",
            label: "Obligation"
          },
          {
            value: "Entite",
            label: "Entité"
          },
          {
            value: "Users",
            label: "Utilisateurs"
          },
          // {
          //   value: "risk ]management",
          //   label: "Risk Management"
          // },
          // {
          //   value: "popular",
          //   label: "Popular"
          // },
          // {
          //   value: "team building",
          //   label: "Team Building"
          // },
        ]}
        onSelect={(value) => {
          console.log(value);
        }}
        listMaxHeight={140} //by default 140
      />
    </div>
  );
}