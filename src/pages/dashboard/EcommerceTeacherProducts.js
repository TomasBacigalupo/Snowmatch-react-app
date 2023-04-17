import { useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
// @mui
import { Container, Grid, Typography, Card, CardContent, Button, Box } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getProducts } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useLocales from 'src/hooks/useLocales';
import ProductSelectForm from 'src/sections/@dashboard/e-commerce/ProductSelectForm';
import CartWidget from 'src/sections/@dashboard/e-commerce/CartWidget';

// ----------------------------------------------------------------------

export default function ProductSelect() {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.product);
    const { translate } = useLocales()
    const { id, productId } = useParams()
    useEffect(() => {
        dispatch(getProducts(true, id));
    }, []);

    return (
        <Page title={translate("product.selection.title")}>
            <Container maxWidth="lg">
                <HeaderBreadcrumbs
                    heading={translate("product.selection.heading")}
                    links={[
                        { name: translate("breadcrumb.dashboard"), href: PATH_DASHBOARD.root },
                        { name: translate("breadcrumb.product"), href: PATH_DASHBOARD.eCommerce.root },
                        { name: translate("product.selection.heading") },
                    ]}
                />
                <CartWidget />
                {products.filter(p => p.id === Number(productId))[0] &&
                    <ProductSelectForm isEdit={false} currentProduct={products.filter(p => p.id === Number(productId))[0]} />
                }
            </Container>
        </Page>
    );
}
