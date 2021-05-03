
import { useQuery } from 'MochiMapHooks';
import { Redirect } from 'react-router-dom';

export default function Transactions () {
  const query = useQuery();
  const type = query.has('tag') ? 'tag' : 'address';
  const address = query.get('tag') || query.get('address');

  return (
    <Redirect to={`/explorer/ledger/${type}/${address}`} />
  );
}
