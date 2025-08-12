//Comma operator example...allows multiple expressions in a place where only one expression is allowed.
#include<stdio.h>
int main(void){
    int a, b, c, sum;
    sum = (a=8, b=7, c=9, a+b+c);
    printf("Sum=%d\n", sum);
    return 0;
}