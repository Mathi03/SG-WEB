/* eslint-disable @typescript-eslint/no-explicit-any */
import { RootState } from "@application/store/store";
import { Component, ElementType, ReactNode } from "react";
import { connect } from "react-redux";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback: ElementType;
  userInfo?: Record<string, any>;
};

type ErrorBoundaryState = {
  error: Error | null;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { error: null };
  }

  render() {
    const { error } = this.state;
    const { children, fallback: Fallback } = this.props;

    if (error !== null) return <Fallback />;

    return children;
  }
}

const mapStateToProps = (state: RootState) => ({
  userInfo: state.user,
});

export default connect(mapStateToProps)(ErrorBoundary);
