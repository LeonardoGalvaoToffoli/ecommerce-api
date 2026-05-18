import { Suspense, lazy, type ReactNode } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';

import { AdminLayout } from '@/app/layouts/AdminLayout';
import { StoreLayout } from '@/app/layouts/StoreLayout';
import { isAdminUser, useAuthStore } from '@/features/auth/stores/authStore';

const AccountPage = lazy(() => import('@/features/account/pages/AccountPage').then((module) => ({ default: module.AccountPage })));
const AdminDashboardPage = lazy(() =>
  import('@/features/admin/pages/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })),
);
const AdminOrdersPage = lazy(() =>
  import('@/features/admin/pages/AdminOrdersPage').then((module) => ({ default: module.AdminOrdersPage })),
);
const AdminProductsPage = lazy(() =>
  import('@/features/admin/pages/AdminProductsPage').then((module) => ({ default: module.AdminProductsPage })),
);
const AdminUsersPage = lazy(() =>
  import('@/features/admin/pages/AdminUsersPage').then((module) => ({ default: module.AdminUsersPage })),
);
const CartPage = lazy(() => import('@/features/cart/pages/CartPage').then((module) => ({ default: module.CartPage })));
const CheckoutPage = lazy(() =>
  import('@/features/checkout/pages/CheckoutPage').then((module) => ({ default: module.CheckoutPage })),
);
const HomePage = lazy(() => import('@/features/catalog/pages/HomePage').then((module) => ({ default: module.HomePage })));
const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then((module) => ({ default: module.LoginPage })));
const OrderSuccessPage = lazy(() =>
  import('@/features/checkout/pages/OrderSuccessPage').then((module) => ({ default: module.OrderSuccessPage })),
);
const ProductDetailPage = lazy(() =>
  import('@/features/catalog/pages/ProductDetailPage').then((module) => ({ default: module.ProductDetailPage })),
);
const ProductsPage = lazy(() =>
  import('@/features/catalog/pages/ProductsPage').then((module) => ({ default: module.ProductsPage })),
);
const RegisterPage = lazy(() =>
  import('@/features/auth/pages/RegisterPage').then((module) => ({ default: module.RegisterPage })),
);

function RouteLoader() {
  return (
    <div className="container-app py-12">
      <div className="h-40 animate-pulse rounded-lg border border-border bg-bg-elevated" />
    </div>
  );
}

function page(element: ReactNode) {
  return <Suspense fallback={<RouteLoader />}>{element}</Suspense>;
}

function ProtectedRoute({ children, adminOnly }: { children: ReactNode; adminOnly?: boolean }) {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/entrar" replace />;
  if (adminOnly && !isAdminUser(user)) return <Navigate to="/" replace />;
  return children;
}

export const router = createBrowserRouter([
  {
    element: <StoreLayout />,
    children: [
      { path: '/', element: page(<HomePage />) },
      { path: '/produtos', element: page(<ProductsPage />) },
      { path: '/produto/:id', element: page(<ProductDetailPage />) },
      { path: '/carrinho', element: page(<CartPage />) },
      { path: '/checkout', element: page(<CheckoutPage />) },
      { path: '/pedido/:id/sucesso', element: page(<OrderSuccessPage />) },
      { path: '/entrar', element: page(<LoginPage />) },
      { path: '/criar-conta', element: page(<RegisterPage />) },
      {
        path: '/minha-conta',
        element: page(
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>,
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: page(<AdminDashboardPage />) },
      { path: 'produtos', element: page(<AdminProductsPage />) },
      { path: 'pedidos', element: page(<AdminOrdersPage />) },
      { path: 'usuarios', element: page(<AdminUsersPage />) },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
