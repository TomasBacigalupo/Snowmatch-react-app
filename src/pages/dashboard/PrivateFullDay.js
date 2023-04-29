import {Container} from "@mui/material";
import HeaderBreadcrumbs from "src/components/HeaderBreadcrumbs";
import Page from "src/components/Page";
import useLocales from "src/hooks/useLocales";
import { PATH_DASHBOARD } from "src/routes/paths";
import PrivateNewEditForm from 'src/sections/@dashboard/e-commerce/PrivateNewEditForm';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "src/redux/store";
import { getProducts } from "src/redux/slices/teachers";
import { getTeacherProducts } from "src/redux/slices/product";
import useAuth from "src/hooks/useAuth";

export default function PrivateFullDay() {
    const { translate } = useLocales()
    const {user} = useAuth()
    const dispatch = useDispatch()
    const products = useSelector((state) => state.product.products)
    const isEdit = products.length > 0 && products.find((product) => product.name === "PRIVATE_FULL_DAY")
    
    useEffect(() => {
        dispatch(getTeacherProducts(user.id))
    }, [dispatch])

    return (
        <Page title={translate("prices.prices")}>
            <Container>
                <HeaderBreadcrumbs
                    heading={translate("breadcrumb.private_full_day")}
                    links={[
                        { name: translate("breadcrumb.dashboard"), href: PATH_DASHBOARD.root },
                        { name: translate("breadcrumb.private_full_day") },
                    ]}
                />
                <PrivateNewEditForm isEdit={isEdit} currentProduct={products.find((product) => product.name === "PRIVATE_FULL_DAY")} isHalfDay={false} />
            </Container>
        </Page>
    )
}