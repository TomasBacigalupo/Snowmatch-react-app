import { useEffect } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
// @mui
import { Container, Grid, Typography, Card, CardContent, Button, Box } from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getTeacherProducts, getTeacherProductsById } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD, PATH_GUEST } from '../../routes/paths';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import useLocales from 'src/hooks/useLocales';
import ProductSelectForm from 'src/sections/@dashboard/e-commerce/ProductSelectForm';
import CartWidget from 'src/sections/@dashboard/e-commerce/CartWidget';
import { getTeacherBiId, getTeacherByID } from 'src/redux/slices/teachers';
import LoadingScreen from 'src/components/LoadingScreen';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

export default function ProductSelect() {

    const dispatch = useDispatch();
    const { id, productId } = useParams();
    const { products } = useSelector((state) => state.product);
    const { teacher } = useSelector((state) => state.teachers);
    const { name, lastname } = teacher || { name: "", lastname: ""};
    const {user} = useAuth();
    const { translate } = useLocales();

    useEffect(() => {
        dispatch(getTeacherProductsById(id));
        dispatch(getTeacherBiId(id));
    }, [id, productId]);

    return (
        <Page title={translate("product.selection.title")}>
            <Container maxWidth="lg">
                <HeaderBreadcrumbs
                    heading={translate("product.selection.heading")}
                    links={[
                        { name: `${name} ${lastname}`, href: user?.role === "TEACHER" ? PATH_DASHBOARD.eCommerce.root : PATH_GUEST.viewTeacher(id) },
                        { name: translate("product.selection.heading") },
                    ]}
                />
                <CartWidget />
                {products && teacher ? (
                    products.filter(p => Number(p.id) === Number(productId))[0] &&
                    <ProductSelectForm
                        currentTeacher={teacher}
                        isEdit={false}
                        currentProduct={products.filter(p => Number(p.id) === Number(productId))[0]} />
                ) : <LoadingScreen />
                }
            </Container>
        </Page>
    );
}
