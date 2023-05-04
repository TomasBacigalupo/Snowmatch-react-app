import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Button,
  Container,
  TextField,
  Typography,
  InputAdornment
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getMyBusinessProducts, getMyTeacherProducts } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator } from '../../hooks/useTable';
import useLocales from 'src/hooks/useLocales';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import InputStyle from "src/components/InputStyle";

// sections
import { ShopProductCard } from 'src/sections/@dashboard/e-commerce/shop';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Product', align: 'left' },
  { id: 'createdAt', label: 'Create at', align: 'left' },
  { id: 'inventoryType', label: 'Status', align: 'center', width: 180 },
  { id: 'price', label: 'Price', align: 'right' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function EcommerceProductList() {
  const {
    order,
    orderBy,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useAuth()
  const {translate} = useLocales();

  const { products } = useSelector((state) => state.product);
  const [tableData, setTableData] = useState([]);
  const [filterName, setFilterName] = useState('');


  useEffect(() => {
    if (user?.role === 'TEACHER') {
      dispatch(getMyTeacherProducts())
    }
    else {
      dispatch(getMyBusinessProducts())
    }
  }, [dispatch]);

  useEffect(() => {
    if (products?.length) {
      setTableData(products);
    }
  }, [products]);

  useEffect(() => {
    console.log("products", products)
  }, [products]);

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  return (
    <Page title="Match">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Product List"
          links={[
            { name: translate("breadcrumb.dashboard"), href: PATH_DASHBOARD.root },
            { name: translate("breadcrumb.group") },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              component={RouterLink}
              to={PATH_DASHBOARD.eCommerce.newProduct}
            >
              {translate("product.add_new_product")}
            </Button>
          }
        />
        <InputStyle
          stretchStart={240}
          value={filterName}
          onChange={(event) => setFilterName(event.target.value)}
          placeholder={translate('general.search')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 5 }}
        />
        {products?.filter(p => p.name !== "PRIVATE_FULL_DAY" && p.name !== "PRIVATE_HALF_DAY").filter(p => p.name.includes(filterName)).sort((a,b) => a.name.toLowerCase() <= b.name.toLowerCase() ? -1 : 1).map((product) => {
          return <ShopProductCard product={product} key={product.id}></ShopProductCard>
        })}
        {!products || (products && products.length === 0) && <Typography>{translate("product.no_products")}</Typography>}
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}
