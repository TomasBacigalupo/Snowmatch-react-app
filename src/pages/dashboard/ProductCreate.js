import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// @mui
import { Container } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { clearProduct, getProduct } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import ProductNewEditForm from '../../sections/@dashboard/e-commerce/ProductNewEditForm';
import useLocales from 'src/hooks/useLocales';

// ----------------------------------------------------------------------

export default function ProductCreate() {
  const { themeStretch } = useSettings();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { id } = useParams();
  const { products, product } = useSelector((state) => state.product);
  const isEdit = pathname.includes('edit');
  const { translate } = useLocales()

  useEffect(() => {
    if (isEdit) {
      dispatch(getProduct(id))
    } else {
      dispatch(clearProduct())
    }
  }, [isEdit]);

  return (
    <Page title={translate("product.title")}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!isEdit ? translate("product.heading.create") : translate("product.heading.edit")}
          links={[
            { name: translate("breadcrumb.dashboard"), href: PATH_DASHBOARD.root},
            { name: translate("breadcrumb.group"), href: PATH_DASHBOARD.eCommerce.viewProducts},
            { name: (!isEdit ? translate("product.new") : product?.name)},
          ]}
        />
        <ProductNewEditForm isEdit={isEdit} currentProduct={product} />
      </Container>
    </Page>
  );
}
